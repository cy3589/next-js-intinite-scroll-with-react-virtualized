// import Poke from '@components/Poke';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

const Poke = dynamic(() => import('@components/Poke'), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <div>
      <Poke />
    </div>
  );
};

export default React.memo(Home);

// export default Home;
// export const getServerSideProps: GetServerSideProps = async () => {
//   const queryClient = new QueryClient();
//   await queryClient.prefetchInfiniteQuery('poke', getPokes);
//   return {
//     props: {
//       dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
//     },
//   };
// };
