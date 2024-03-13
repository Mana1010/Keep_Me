import jwt from "jsonwebtoken";
import "dotenv/config";
export function createRefreshToken(id: string) {
  return jwt.sign(
    { id },
    "62a8ed53583e6e9b4c83636e1da2756def151617fbfa35ef7bdbf2e6066f4bc08d8ad0ad74849fceb9d6cdf96603c560b6cbb2023334e069679498a2cb62ef68",
    {
      expiresIn: "1d",
    }
  );
}
export function createAccessToken(id: string) {
  return jwt.sign(
    { id },
    "60eda1d692b90f8ab40da6dd25fadec36cb4c598f724f33c130b8ed06f643ffbdd3cabb03c563754f55f216e377e3b87c5c57cbb57b5e731075fdbeb8bc45f54",
    {
      expiresIn: "15m",
    }
  );
}
