import { selectAuthUser } from "@/slices/authSlice";
import { useSelector } from "react-redux";

export const getUserProfile = async (username: string) => {
  const { getSingleProfile } = await import(
    "deso-protocol"
  );
  const params = {
    Username: username,
    PublicKeyBase58Check: "",
  };

  return await getSingleProfile(params);
};
