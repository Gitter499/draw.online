import { ws } from "../util/WebSocket";
import { FiSend } from "react-icons/fi";
import userContext from "../data/user.context";
import {
  chakra,
  Center,
  Box,
  Text,
  Divider,
  Input,
  Stack,
  IconButton,
} from "@chakra-ui/react";
import { Redirect } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import Canvas from "../components/Canvas";
import useWindowDimensions from "../hooks/useWindowSize";

const Draw = () => {
  const chatRef = useRef();
  // const toast = useToast();
  // const history = useHistory();
  const { data } = useContext(userContext);
  const [messages, setMessages] = useState([]);

  const { width } = useWindowDimensions();

  const initialMessageFetch = () => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type: "initial chat state" }));
    } else {
      ws.onopen = () => {
        ws.send(JSON.stringify({ type: "initial chat state" }));
      };
    }

    ws.onmessage = (message) => {
      const parsed = JSON.parse(message.data);
      if (parsed?.type === "initial chat state ok") {
        setMessages(parsed?.data);
      }
    };
  };

  const sendMessage = (event) => {
    event.preventDefault();
    const { value } = event.target.message;

    if (ws.readyState === ws.OPEN) {
      ws.send(
        JSON.stringify({
          type: "send message",
          data: { message: value, username: data?.username },
        })
      );
    } else {
      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            type: "send message",
            data: { message: value, username: data?.username },
          })
        );
      };
    }

    ws.onmessage = (message) => {
      const parsed = JSON.parse(message.data);

      if (parsed?.type === "update chat state") {
        setMessages(parsed?.data);
      }
    };

    event.currentTarget.message.value = null;
    chatRef.current.scrollIntoView(false);
  };

  useEffect(() => {
    initialMessageFetch();
    return () => setMessages([]);
  }, []);

  if (!data?.username || data.username === "") {
    return <Redirect to={"/"} />;
  } else
    return (
      <Box minH={"100vh"}>
        <Box>
          <Box
            minW={"full"}
            left={0}
            minH={"100vh"}
            position={"fixed"}
            bgColor={"purple.500"}
            pt={"12px"}
          >
            <Canvas _width={parseInt(width)} _height={680}></Canvas>
          </Box>

          <Box
            w={"md"}
            right={0}
            minH={"100vh"}
            overflowY={"none"}
            position={"fixed"}
            bgColor={"gray.50"}
          >
            <Box p={2}>
              <Box>
                <Text textAlign={"center"} fontWeight={"bold"} fontSize={"3xl"}>
                  Chat
                </Text>
                <Divider />

                <Box
                  h={550}
                  ref={chatRef}
                  overflowY={"scroll"}
                  overflowX={"hidden"}
                >
                  {messages?.map((item, index) => {
                    return (
                      <>
                        <Box key={index + Math.random()}>
                          <Text fontWeight={"semibold"}>
                            <chakra.span
                              fontStyle={"italic"}
                              fontWeight={"bold"}
                            >
                              {item?.user}
                            </chakra.span>{" "}
                            - <chakra.span>{item?.message}</chakra.span>
                          </Text>
                        </Box>
                        <Divider />
                      </>
                    );
                  })}
                </Box>
              </Box>

              <Center>
                <Box>
                  <Text>Message format</Text>
                  <Text>Author - Message</Text>
                </Box>
              </Center>

              <form onSubmit={sendMessage}>
                <Stack mb={5} bottom={0} position={"fixed"} direction={"row"}>
                  <Input
                    w={"sm"}
                    name={"message"}
                    variant={"filled"}
                    colorScheme={"purple"}
                    placeholder={"Enter your message"}
                  />
                  <IconButton
                    type={"submit"}
                    icon={<FiSend />}
                    borderRadius={"lg"}
                    colorScheme={"purple"}
                  />
                </Stack>
              </form>
            </Box>
          </Box>
        </Box>
      </Box>
    );
};

export default Draw;
