import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { QueryClient, useInfiniteQuery } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import axios from 'axios';
import {
  InfiniteLoader,
  AutoSizer,
  List,
  // OnScrollParams,
  WindowScroller,
  // ScrollParams,
  CellMeasurer,
  CellMeasurerCache,
} from 'react-virtualized';
import React, { CSSProperties, useRef, VFC } from 'react';
import Image from 'next/image';

const Row: VFC<{
  index: number;
  style: CSSProperties;
  data?: { name: string; url: string };
}> = React.memo(({ index, style, data }) => {
  if (!data) return null;
  return (
    <div key={index} style={style}>
      <div>{index}번째 포켓몬</div>
      <div>{data.name}</div>
      <div style={{ position: 'relative' }}>
        <Image
          src={data.url}
          alt={data.url}
          height={100}
          width={100}
          layout="fixed"
          priority
        />
      </div>
    </div>
  );
});

Row.displayName = 'Row';

const getPokes = async ({ pageParam = 0 }) => {
  const { data: dataArr } = await axios.get(
    `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${pageParam}`,
  );
  const newResults = await Promise.all(
    dataArr.results.map(
      async ({ name, url }: { name: string; url: string }) => {
        const { data: detail } = await axios.get(url);
        return { name, url: detail.sprites.front_default };
      },
    ),
  );
  return { ...dataArr, results: newResults };
};

const Home: NextPage = () => {
  const cache = useRef<CellMeasurerCache>(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 100,
    }),
  );
  const { data, fetchNextPage, isFetching } = useInfiniteQuery(
    'poke',
    getPokes,
    {
      getNextPageParam: (lastPage) => {
        return new URLSearchParams(
          lastPage.next.split('?')[lastPage.next.split('?').length - 1],
        ).get('offset');
      },
    },
  );
  const render = data?.pages.flatMap(({ results }) => results);
  return (
    <div>
      <Head>
        <title>Infinite Scroll with React-Query</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {Array(300)
        .fill(null)
        .map((v, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={i}>{i}</div>
        ))}
      <InfiniteLoader
        isRowLoaded={({ index }) => (render ? index < render?.length : true)}
        rowCount={Infinity}
        loadMoreRows={async () => {
          if (data && Array.isArray(data?.pages) && !isFetching)
            await fetchNextPage(data.pages[data.pages.length - 1]);
        }}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ isScrolling, height, scrollTop }) => {
              return (
                <AutoSizer disableHeight>
                  {({ width }) => (
                    <List
                      // serverStyle과 달라서 생기는 경고 해결
                      style={{ overflowY: 'hidden' }}
                      autoHeight
                      onRowsRendered={onRowsRendered}
                      ref={registerChild}
                      height={height}
                      width={width}
                      rowHeight={cache.current.rowHeight}
                      rowCount={render?.length || 20}
                      overscanRowCount={4}
                      scrollTop={scrollTop}
                      isScrolling={isScrolling}
                      // eslint-disable-next-line react/no-unstable-nested-components
                      rowRenderer={({ key, index, style, parent }) => (
                        <CellMeasurer
                          key={key}
                          cache={cache.current}
                          parent={parent}
                          columnIndex={0}
                          rowIndex={index}
                        >
                          <Row
                            index={index}
                            style={style}
                            data={Array.isArray(render) && render[index]}
                          />
                        </CellMeasurer>
                      )}
                    />
                  )}
                </AutoSizer>
              );
            }}
          </WindowScroller>
        )}
      </InfiniteLoader>
    </div>
  );
};
export default React.memo(Home);

// export default Home;
export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery('poke', getPokes);
  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
