import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

const API_URL = 'https://ohou.se';

const InfiniteLoadFunctionAPI = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  res.status(200).json({ name: 'John Doe' });
};

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>,
// ) {
//   res.status(200).json({ name: 'John Doe' });
// }

export default InfiniteLoadFunctionAPI;
