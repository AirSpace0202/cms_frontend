import myAxios from "../plugins/myAxios";
// @ts-ignore
import { setCurrentUserState } from "src/states/user.ts";

export const getCurrentUser = async () => {
  // const currentUser = getCurrentUserState();
  // if (currentUser) {
  //     return currentUser;
  // }
  // 当前用户信息不存在则从远程获取
  const res = await myAxios.get("/user/current");
  if (res) {
    setCurrentUserState(res.data);
    return res.data;
  }
  return null;
};
