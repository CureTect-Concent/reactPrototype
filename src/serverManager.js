import dataManager from "./dataManager";
import axios from "axios";

const SERVER_MAIN = "https://api.concent.kro.kr:7001";
let TOKEN; //accessToken ,refreshToken, tokenType
const getToken = async () => {
  return await JSON.parse(await dataManager.getValueForIdToken());
};

export default class serverManager {
  static loginAuto = async () => {
    const res = await fetch(`${SERVER_MAIN}/auth/web`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: "1234",
        phoneNumber: "01012341234",
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("자동로그인 성공");
        return json;
      })
      .catch((error) => {
        console.error(error);
      });
    dataManager.setValueForIdToken(JSON.stringify(res));
    console.log(res);
  };

  static saveChats = async (chats, Images) => {
    if (TOKEN === undefined);
    {
      TOKEN = await getToken();
    }
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${TOKEN.accessToken}`; // 중요
    const resObj = await axios
      .post(`${SERVER_MAIN}/save`, chats)
      .then((response) => {
        console.log("응답");
        console.log(response.data);
        return response.data;
      })
      .catch((err) => {
        console.log(err);
      });

    if (Images && Images.length) {
      console.log("사진보내기 동작?");
      console.log(Images);
      this.saveChatsForImage(Images, resObj.messageIds, resObj.chatLogId);
    }
  };
  static saveChatsForImage = async (Images, messageIds, saveChatId) => {
    const body = new FormData();
    //const formData = new FormData();
    //formData.append("images", Images);
    //formData.append("messageIds", messageIds);
    Images.map((img, index) => {
      var photo = {
        uri: img.uri,
        type: img.type,
        name: img.name,
      };
      body.append("images", photo);
    });
    messageIds.map((value, index) => {
      body.append("messageIds", value);
    });

    console.log("사진보내기 프로세스 시작");
    console.log("데이터검증");
    console.log(Images);
    console.log(messageIds);
    console.log(saveChatId);
    console.log(body);

    //console.log(formData);
    if (TOKEN === undefined);
    {
      TOKEN = await getToken();
    }
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${TOKEN.accessToken}`; // 중요
    axios
      .post(`${SERVER_MAIN}/save/image/${saveChatId}`, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("사진보내기 응답");
        console.log(response.data);
      })
      .catch((err) => {
        console.log("사진보내기 에러");
        console.log(err);
      });
  };

  // static saveChats2 = async (chats) => {
  //   const res = await fetch(`${SERVER_MAIN}/save`, {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${TOKEN.accessToken}`,
  //     },
  //     body: {
  //       chatLogMessageRequests: [
  //         {
  //           message: "테스트",
  //           messageType: "MESSAGE",
  //           writeAt: "2022-01-18 18:42:00",
  //         },
  //       ],
  //       content: "하이",
  //       contentBackgroundType: "FULL_SCREEN",
  //       title: "제목입니다",
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((json) => {
  //       return json;
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  //   console.log(res);
  // };
}
