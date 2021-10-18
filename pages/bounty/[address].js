import { useRouter } from "next/router";

const address = () => {
  const router = useRouter();
  const { address } = router.query;

  return <div>Im {address}</div>;
};

export default address;
