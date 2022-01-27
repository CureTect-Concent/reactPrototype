import dataManager from "./dataManager";
import axios from "axios";
import * as mime from "mime";

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
    console.log("form데이터");
    Images.map((img, index) => {
      var file = {
        uri: img.uri,
        type: mime.getType(img.uri),
        name: img.name,
      };
      body.append("images", file);
    });
    messageIds.map((value, index) => {
      body.append("messageIds", value);
    });

    // console.log("사진보내기 프로세스 시작");
    // console.log("데이터검증");
    // console.log(Images);
    // console.log(messageIds);
    // console.log(saveChatId);
    // console.log(body);
    if (TOKEN === undefined);
    {
      TOKEN = await getToken();
    }
    //let header = { headers: { 'Accept': '*', 'Authorization': 'Bearer '+token, 'Content-Type': 'multipart/form-data' } };
    // axios.defaults.headers.common[
    //   "Authorization"
    // ] = `Bearer ${TOKEN.accessToken}`; // 중요
    // axios
    //   .post(`${SERVER_MAIN}/save/image/${saveChatId}`, body, {
    //     headers: {
    //       "Content-Type": `multipart/form-data`,
    //     },
    //   })
    //   .then((response) => {
    //     console.log("사진보내기 응답");
    //     console.log(response.data);
    //   })
    //   .catch((err) => {
    //     console.log("사진보내기 에러");
    //     console.log(err.response);
    //   });
    fetch(`${SERVER_MAIN}/save/image/${saveChatId}`, {
      method: "POST",
      body: body,
      headers: {
        Authorization: `Bearer ${TOKEN.accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        console.log("성공이랄까");
        console.log(res);
      })
      .catch((err) => {
        console.log(" 에러랄까");
        console.log(err.response);
      });
  };

  static getChatRooms = async (index = 0) => {
    if (TOKEN === undefined);
    {
      TOKEN = await getToken();
    }
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${TOKEN.accessToken}`; // 중요
    const resObj = await axios
      .get(`${SERVER_MAIN}/save/all/${index}`)
      .then((response) => {
        console.log("응답");
        // console.log(response);
        return response.data;
      })
      .catch((err) => {
        console.log(err);
      });
    // resObj.map((Textvar, index) => {
    //   console.log(`-------------${index}번째--------------`);
    //   console.log(Textvar);
    //   console.log(`---------------------------------------`);
    // });
    return await resObj;
  };

  static getChats = async (chatRoomId, index = 0) => {
    // console.log("룸아이디 검증");
    // console.log(chatRoomId);
    if (TOKEN === undefined);
    {
      TOKEN = await getToken();
    }
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${TOKEN.accessToken}`; // 중요
    const params = { contentId: chatRoomId };
    return await axios
      .get(`${SERVER_MAIN}/editor/message/${index}`, { params })
      .then((response) => {
        console.log("응답");
        //  console.log(response);
        return response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  static getImageUri = (imageUri) => {
    return `https://cocent-bucket.s3.ap-northeast-2.amazonaws.com/${imageUri}`;
  };
}
