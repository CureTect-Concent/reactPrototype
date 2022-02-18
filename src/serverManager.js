import dataManager from "./dataManager";
import axios from "axios";
import * as mime from "mime";
import base64 from "react-native-base64";

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
    Images.map((img) => {
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

  static editorAddText = async (chatObjs, chatId) => {
    const body = new FormData();

    //const addchatsObj = TextMessageJson;
    // var TextMessageJson = {
    //   addMessageRequests: [
    //     {
    //       messageId: 898,
    //       transformScreen: false,
    //       position: "BOTTOM_RIGHT",
    //       textColor: "", //텍스트색이 없을 경우 ""빈값
    //       text: "추가테스트", //수정 안했을시 기존 내용 그대로
    //       backgroundColor: "", //없거나 이미지일경우 ""빈값
    //       alpha: "1.0",
    //       messageColor: "", //말풍선 색깔
    //       backgroundType: "DEFAULT", //IMAGE, COLOR, DEFAULT
    //     },
    //   ],
    // };

    body.append("jsonData", JSON.stringify(chatObjs));

    console.log(`----------------데이터검증------------------`);
    console.log(body);
    console.log(`----------------데이터검증------------------`);

    if (TOKEN === undefined);
    {
      TOKEN = await getToken();
    }
    await fetch(`${SERVER_MAIN}/editor/add/text/${chatId}`, {
      //mode: "cors",
      method: "PUT",
      body: body,
      headers: {
        //"Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN.accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log("성공이랄까");
        console.log(JSON.parse(JSON.stringify(response)));
        // alert(JSON.stringify(response));
        // response.json().then((json) => {
        //   alert(JSON.stringify(json));
        // });
      })
      .catch((err) => {
        console.log(" 에러랄까");
        console.log(err.response);
      });

    // axios.defaults.headers.common[
    //   "Authorization"
    // ] = `Bearer ${TOKEN.accessToken}`; // 중요

    // return await axios
    //   .put(`${SERVER_MAIN}/editor/add/text/${chatId}`, body, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   })
    //   .then((response) => {
    //     console.log("응답");
    //     console.log(response);
    //     //return response;
    //   })
    //   .catch((err) => {
    //     console.log(err.response);
    //   });
  };

  static editorAddImage = async (messageId, Images, chatId) => {
    const body = new FormData();
    let TextMessageJson = {
      addMessageRequests: [],
    };

    Images.map((img, index) => {
      var file = {
        uri: img.uri,
        type: mime.getType(img.uri),
        name: img.uri.split("/").pop(),
      };
      TextMessageJson.addMessageRequests.push({
        messageId: messageId,
        width: "0.0",
        height: "0.0",
        isResizing: false,
        transformScreen: false,
        position: "BOTTOM_RIGHT",
        backgroundColor: "", //없거나 이미지일경우 ""빈값
        backgroundType: "DEFAULT", //IMAGE, COLOR, DEFAULT
      });
      body.append("images", file);
    });
    body.append("jsonData", JSON.stringify(TextMessageJson));

    console.log(`----------------데이터검증------------------`);
    console.log(body);
    console.log(`----------------데이터검증------------------`);

    if (TOKEN === undefined);
    {
      TOKEN = await getToken();
    }
    await fetch(`${SERVER_MAIN}/editor/add/image/${chatId}`, {
      method: "PUT",
      body: body,
      headers: {
        Authorization: `Bearer ${TOKEN.accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log("성공이랄까");
        console.log(JSON.parse(JSON.stringify(response)));
      })
      .catch((err) => {
        console.log(" 에러랄까");
        console.log(err.response);
      });
  };

  static editorEditChatInFO = async (Images, contentId, titleV, dectV) => {
    console.log("editorEditCHatInFO테스트");
    console.log(`데이터검증 배경사진: ${JSON.stringify(Images)}`);
    console.log(`데이터검증 아이디: ${contentId}`);
    // var ImgValue = {
    //   uri: bgImage.uri,
    //   type: mime.getType(bgImage.uri),
    //   name: "BGConcentPic",
    // };

    const body = new FormData();
    console.log("form데이터");
    body.append("backgroundColor", "");
    Images.map((img, index) => {
      var file = {
        uri: img.uri,
        type: mime.getType(img.uri),
        name: img.uri.split("/").pop(),
      };
      body.append("backgroundImage", file);
      body.append("images", file);
    });
    body.append("title", titleV);
    body.append("categories", 702);
    body.append("dect", dectV);
    console.log("---------------editorEditCHatInFO form데이터 검증---------");
    console.log(body);
    console.log("----------------editorEditCHatInFO form데이터 검증---------");

    if (TOKEN === undefined);
    {
      TOKEN = await getToken();
    }
    fetch(`${SERVER_MAIN}/editor/edit/${contentId}`, {
      method: "POST",
      body: body,
      headers: {
        Authorization: `Bearer ${TOKEN.accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log("성공이랄까");
        console.log(JSON.parse(JSON.stringify(response)));
      })
      .catch((response) => {
        console.log(" 에러랄까");
        console.log(response);
      });

    // axios.defaults.headers.common[
    //   "Authorization"
    // ] = `Bearer ${TOKEN.accessToken}`; // 중요

    // return await axios
    //   .post(`${SERVER_MAIN}/editor/edit/${contentId}`, body)
    //   .then((response) => {
    //     console.log("응답");
    //     console.log(response);
    //     //return response;
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };
  static usedEditorEditChatInFO = async (Images, contentId, title, dect) => {
    console.log("editorEditCHatInFO테스트");
    console.log(`데이터검증 배경사진: ${JSON.stringify(Images)}`);
    console.log(`데이터검증 아이디: ${contentId}`);
    const body = new FormData();
    console.log("form데이터");
    body.append("backgroundColor", "");
    Images.map((img, index) => {
      var file = {
        uri: img.uri,
        type: mime.getType(img.uri),
        name: img.uri.split("/").pop(),
      };
      body.append("backgroundImage", file);
      body.append("images", file);
    });
    body.append("title", title);
    body.append("categories", 702);
    body.append("dect", dect);
    console.log("----------------form데이터 검증---------");
    console.log(body);
    console.log("----------------form데이터 검증---------");

    if (TOKEN === undefined);
    {
      TOKEN = await getToken();
    }
    fetch(`${SERVER_MAIN}/editor/edit/${contentId}`, {
      method: "PUT",
      body: body,
      headers: {
        Authorization: `Bearer ${TOKEN.accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log("성공이랄까");
        console.log(JSON.parse(JSON.stringify(response)));
      })
      .catch((response) => {
        console.log(" 에러랄까");
        console.log(response);
      });
  };

  static editorEditMsgText = async (contentId) => {
    console.log("editorEditCHatInFO테스트");
    // console.log(`데이터검증 편집텍스트: ${JSON.stringify(Images)}`);
    const valueText = "1다음에는 2일까나";
    var updateTextRequests = [
      {
        messageId: 898,
        text: valueText,
      },
    ];

    console.log(`데이터검증 아이디: ${contentId}`);

    if (TOKEN === undefined);
    {
      TOKEN = await getToken();
    }
    fetch(`${SERVER_MAIN}/editor/message/text/${contentId}`, {
      method: "PUT",
      body: JSON.stringify(updateTextRequests),
      headers: {
        Authorization: `Bearer ${TOKEN.accessToken}`,
        "Content-Type": "application/json",
        //"Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log("성공이랄까");
        console.log(JSON.parse(JSON.stringify(response)));
      })
      .catch((e) => {
        console.log(" 에러랄까");
        console.log(JSON.parse(JSON.stringify(e)));
        // console.log(e.response);
      });
  };

  static editorEditMsgImgResizing = async (contentId) => {
    console.log("editorEditCHatInFO테스트");
    // console.log(`데이터검증 편집텍스트: ${JSON.stringify(Images)}`);
    var updateMessageImageSizeRequests = [
      {
        height: 0,
        messageId: 896,
        width: 1,
      },
    ];

    console.log(`데이터검증 아이디: ${contentId}`);

    if (TOKEN === undefined);
    {
      TOKEN = await getToken();
    }
    fetch(`${SERVER_MAIN}/editor/message/image/resizing/${contentId}`, {
      method: "PUT",
      body: JSON.stringify(updateMessageImageSizeRequests),
      headers: {
        Authorization: `Bearer ${TOKEN.accessToken}`,
        "Content-Type": "application/json",
        //"Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log("성공이랄까");
        console.log(JSON.parse(JSON.stringify(response)));
      })
      .catch((e) => {
        console.log(" 에러랄까");
        console.log(JSON.parse(JSON.stringify(e)));
        // console.log(e.response);
      });
  };

  static editorEditMsgColor = async (contentId) => {
    console.log("editorEditCHatInFO테스트");
    // console.log(`데이터검증 편집텍스트: ${JSON.stringify(Images)}`);
    var setMessageColorRequests = [
      {
        alpha: "1.0",
        color: "#000053",
        messageId: 898,
        textColor: "#ffffff",
      },
    ];

    console.log(`데이터검증 아이디: ${contentId}`);

    if (TOKEN === undefined);
    {
      TOKEN = await getToken();
    }
    fetch(`${SERVER_MAIN}/editor/message/color/${contentId}`, {
      method: "PUT",
      body: JSON.stringify(setMessageColorRequests),
      headers: {
        Authorization: `Bearer ${TOKEN.accessToken}`,
        "Content-Type": "application/json",
        //"Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log("성공이랄까");
        console.log(JSON.parse(JSON.stringify(response)));
      })
      .catch((e) => {
        console.log(" 에러랄까");
        console.log(JSON.parse(JSON.stringify(e)));
        // console.log(e.response);
      });
  };

  static editorBgImg = async (Images, contentId) => {
    console.log("editorEditCHatInFO테스트");
    console.log(`데이터검증 배경사진: ${JSON.stringify(Images)}`);
    console.log(`데이터검증 아이디: ${contentId}`);
    const body = new FormData();
    console.log("form데이터");
    Images.map((img, index) => {
      var file = {
        uri: img.uri,
        type: mime.getType(img.uri),
        name: img.uri.split("/").pop(),
      };
      body.append("images", file);
    });
    body.append("messageIds ", 898);
    console.log("----------------form데이터 검증---------");
    console.log(body);
    console.log("----------------form데이터 검증---------");

    if (TOKEN === undefined);
    {
      TOKEN = await getToken();
    }
    fetch(`${SERVER_MAIN}/editor/background/image/${contentId}`, {
      method: "PUT",
      body: body,
      headers: {
        Authorization: `Bearer ${TOKEN.accessToken}`,
        //"Content-Type": "application/json",
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log("성공이랄까");
        console.log(JSON.parse(JSON.stringify(response)));
      })
      .catch((e) => {
        console.log(" 에러랄까");
        console.log(JSON.parse(JSON.stringify(e)));
        // console.log(e.response);
      });
  };

  static editorDeleteMsg = async (contentId) => {
    console.log("editorEditCHatInFO테스트");
    // console.log(`데이터검증 편집텍스트: ${JSON.stringify(Images)}`);
    var setMessageColorRequests = [
      {
        messageId: 898,
      },
    ];

    console.log(`데이터검증 아이디: ${contentId}`);

    if (TOKEN === undefined);
    {
      TOKEN = await getToken();
    }
    fetch(`${SERVER_MAIN}/editor/delete/message/${contentId}`, {
      method: "DELETE",
      body: JSON.stringify(setMessageColorRequests),
      headers: {
        Authorization: `Bearer ${TOKEN.accessToken}`,
        "Content-Type": "application/json",
        //"Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log("성공이랄까");
        console.log(JSON.parse(JSON.stringify(response)));
      })
      .catch((e) => {
        console.log(" 에러랄까");
        console.log(JSON.parse(JSON.stringify(e)));
        // console.log(e.response);
      });
  };

  static editorAll = async (contentId, chatObj, Images, BgImages) => {
    console.log(`editorAll`);
    console.log(`데이터검증 배경사진: ${JSON.stringify(Images)}`);
    //console.log(`데이터검증 아이디: ${contentId}`);
    const body = new FormData();
    // console.log("form데이터");
    //console.log(serverManager.getImageUri(Images[0]));
    if (Images.length !== 0) {
      Images.map((img, index) => {
        var file = {
          uri: img.uri,
          type: mime.getType(img.uri),
          name: img.uri.split("/").pop(),
        };
        body.append("messageImages", file);
      });
    } else {
      // body.append("messageImages", "");
    }
    if (BgImages.length !== 0) {
      BgImages.map((img, index) => {
        var file = {
          uri: img.uri,
          type: mime.getType(img.uri),
          name: img.uri.split("/").pop(),
        };
        body.append("backgroundImages", file);
      });
    } else {
      // body.append("backgroundImages", "");
    }

    let ChatMessageJson = { ...chatObj };
    console.log("-------------- editorAll json------------");
    console.log(ChatMessageJson);
    console.log("--------------editorAll json------------");

    body.append("jsonData", JSON.stringify(ChatMessageJson));
    //console.log("----------------form데이터 검증---------");
    // console.log(body);
    // console.log("----------------form데이터 검증---------");

    if (TOKEN === undefined);
    {
      TOKEN = await getToken();
    }
    const isDone = fetch(`${SERVER_MAIN}/editor/all/${contentId}`, {
      method: "PUT",
      body: body,
      headers: {
        Authorization: `Bearer ${TOKEN.accessToken}`,
        //"Content-Type": "application/json",
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log("성공이랄까");
        console.log(JSON.parse(JSON.stringify(response)));
        return true;
      })
      .catch((e) => {
        console.log(" 에러랄까");
        console.log(JSON.parse(JSON.stringify(e)));
        // console.log(e.response);
      });

    return isDone;
  };

  static editorDeleteMsg = async (contentId) => {
    console.log("editorEditCHatInFO테스트");
    // console.log(`데이터검증 편집텍스트: ${JSON.stringify(Images)}`);
    var setMessageColorRequests = [
      {
        messageId: 898,
      },
    ];

    console.log(`데이터검증 아이디: ${contentId}`);

    if (TOKEN === undefined);
    {
      TOKEN = await getToken();
    }
    fetch(`${SERVER_MAIN}/editor/delete/message/${contentId}`, {
      method: "DELETE",
      body: JSON.stringify(setMessageColorRequests),
      headers: {
        Authorization: `Bearer ${TOKEN.accessToken}`,
        "Content-Type": "application/json",
        //"Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log("성공이랄까");
        console.log(JSON.parse(JSON.stringify(response)));
      })
      .catch((e) => {
        console.log(" 에러랄까");
        console.log(JSON.parse(JSON.stringify(e)));
        // console.log(e.response);
      });
  };

  static deleteContent = async (contentId) => {
    console.log(`데이터검증 아이디: ${contentId}`);

    if (TOKEN === undefined);
    {
      TOKEN = await getToken();
    }
    fetch(`${SERVER_MAIN}/content/${contentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${TOKEN.accessToken}`,
        "Content-Type": "application/json",
        //"Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log("성공이랄까");
        console.log(JSON.parse(JSON.stringify(response)));
      })
      .catch((e) => {
        console.log(" 에러랄까");
        console.log(JSON.parse(JSON.stringify(e)));
        // console.log(e.response);
      });
  };

  static contentOpen = async (contentId) => {
    console.log(`데이터검증 아이디: ${contentId}`);

    if (TOKEN === undefined);
    {
      TOKEN = await getToken();
    }
    fetch(`${SERVER_MAIN}/content/open/${contentId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${TOKEN.accessToken}`,
        "Content-Type": "application/json",
        //"Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log("성공이랄까");
        console.log(JSON.parse(JSON.stringify(response)));
      })
      .catch((e) => {
        console.log(" 에러랄까");
        console.log(JSON.parse(JSON.stringify(e)));
        // console.log(e.response);
      });
  };

  static getContentMe = async (index = 0) => {
    // console.log("룸아이디 검증");
    // console.log(chatRoomId);
    if (TOKEN === undefined);
    {
      TOKEN = await getToken();
    }
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${TOKEN.accessToken}`; // 중요
    return await axios
      .get(`${SERVER_MAIN}/content/me/${index}`)
      .then((response) => {
        console.log("응답");
        //  console.log(response);
        return response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  };
}
