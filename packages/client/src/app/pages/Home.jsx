import {
  Box,
  Flex,
  Text,
  chakra,
  Input,
  Stack,
  FormControl,
  FormLabel,
  Center,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { ws } from "../util/WebSocket";
import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import userContext from "../data/user.context";
import { AiFillCaretRight } from "react-icons/ai";

const Home = () => {
  const toast = useToast();
  const history = useHistory();
  const { setData } = useContext(userContext);
  const [state, setState] = useState({ usernameOK: false });

  const handleUsernameChange = (event) => {
    if (event.target.value.length < 8) setState({ usernameOK: false });
    else setState({ usernameOK: true });
  };

  const join = (value) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type: "set username", data: value }));
    } else {
      ws.onopen = () => {
        ws.send(JSON.stringify({ type: "set username", data: value }));
      };
    }

    ws.onmessage = (message) => {
      const parsed = JSON.parse(message.data);

      if (parsed?.type?.toLowerCase() === "set username ok") {
        setData({
          username: value,
          players: parsed?.data,
        });
        history.push("/draw");
      } else if (parsed?.type?.toLowerCase() === "set username not ok") {
        toast({
          title: "That username is already in use 😢",
        });
      } else {
        toast({
          title: "Unhandled Exception",
        });
      }
    };

    return;
  };

  const handleJoin = (event) => {
    event.preventDefault();
    const { value } = event.target.username;
    join(value);
  };

  return (
    <Box minH={"100vh"}>
      <Flex minH={"100vh"} alignItems={"center"} justifyContent={"center"}>
        <Box mb={"40"}>
          <Stack spacing={5}>
            <Box textAlign={"center"}>
              <Text fontSize={"4xl"} fontWeight={"semibold"}>
                drawonline<chakra.span color={"purple.500"}>.xyz</chakra.span>
              </Text>
              <Text fontSize={"lg"} color={"gray.400"} fontWeight={"bold"}>
                Your place to draw anything you want with people from all around
                the world
              </Text>
            </Box>

            <Center>
              <Box>
                <FormControl>
                  <FormLabel fontWeight={"semibold"} color={"purple.500"}>
                    Choose a username to get started!
                  </FormLabel>

                  <form onSubmit={handleJoin}>
                    <Stack direction={"row"}>
                      <Input
                        w={"sm"}
                        required
                        type={"text"}
                        minLength={"8"}
                        name={"username"}
                        variant={"outline"}
                        onChange={handleUsernameChange}
                        placeholder={"Minimum 8 characters"}
                      />
                      <IconButton
                        rounded={"lg"}
                        type={"submit"}
                        icon={<AiFillCaretRight />}
                        isDisabled={!state.usernameOK}
                        colorScheme={state.usernameOK ? "purple" : "gray"}
                      />
                    </Stack>
                  </form>
                </FormControl>
              </Box>
            </Center>
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
};

export default Home;
