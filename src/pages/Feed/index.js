import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import LazyImage from '../../Components/LazyImage'
import { Post, Header, Avatar, Name, Description, Loading } from './styles'

export default function pages() {
  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState();
  const [viewable, setViewable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function loadPage(pageNumber = page, shouldRefresh = false) {

    if (pageNumber === total) return;
    if (loading) return;

    setLoading(true);

    const response = await fetch(`http://localhost:3000/feed?_expand=author&_limit=5&_page=${pageNumber}`);

    const totalItems = response.headers.get('X-Total-Count');
    const data = await response.json();

    setLoading(false);
    setTotal(Math.floor(totalItems / 4));
    setPage(pageNumber + 1);

    setFeed(shouldRefresh ? data : [...feed, ...data]);
  }
  useEffect(() => {
    loadPage();
  }, []);

  async function refreshList() {
    setRefreshing(true);

    await loadPage(1, true);

    setRefreshing(false);
  }

  const handleViewableChanged = useCallback(({ changed }) => {
    setViewable(changed.map(({ item }) => item.id));
  }, []);

  return (
    <View >
      <FlatList
        data={feed}
        keyExtractor={item => String(item.id)}
        onEndReachedThreshold={0.1}
        onEndReached={() => loadPage()}
        onRefresh={refreshList}
        refreshing={refreshing}
        onViewableItemsChanged={handleViewableChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 20 }}
        ListFooterComponent={loading && <Loading />}
        renderItem={({ item }) => (
          <Post>
            <Header>
              <Avatar source={{ uri: item.author.avatar }} />
              <Name>{item.author.name}</Name>
            </Header>
            <LazyImage
              shouldLoad={viewable.includes(item.id)}
              aspectRatio={item.aspectRatio}
              source={{ uri: item.image }}
              smallSource={{ uri: item.small }} />
            <Description>
              <Name>{item.author.name}</Name> {item.description}
            </Description>
          </Post>
        )} />
    </View>
  );
}


