require("dotenv").config();

const ws = require("ws");
const cors = require("cors");
const app = require("express")();
const Data = require("./data/index");
const { COOKIE_SECRET } = process.env;
const port = process.env.PORT || 4000;
const cookieParser = require("cookie-parser");
const server = require("http").createServer(app);

const wss = new ws.Server({
  server,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3,
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024,
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024, // Size (in bytes) below which messages
    // should not be compressed.
  },
});

// Adding the middleware
app.use(cookieParser(COOKIE_SECRET));
app.use(cors({ origin: true, credentials: true }));

/**
 *
 * @param {String} message
 * @returns {Object}
 */
const parse = (message) => {
  const parsed = JSON.parse(message);
  return parsed;
};

wss.on("connection", (socket, request) => {
  socket.on("message", (data) => {
    const parsed = parse(data);

    switch (parsed.type) {
      case "update draw state": {
        wss.clients.forEach((client) => {
          client !== socket &&
            client.send(
              JSON.stringify({ type: "update draw state", data: parsed.data })
            );
        });
      }
      case "send message": {
        Data.sendMessage(parsed.data.message, parsed.data.username);
        wss.clients.forEach((client) => {
          client.send(
            JSON.stringify({ type: "update chat state", data: Data.chat })
          );
        });
      }
      case "initial draw state": {
        return socket.send(
          JSON.stringify({ type: "initial draw state", data: Data.state })
        );
      }
      case "initial chat state": {
        return socket.send(
          JSON.stringify({ type: "initial chat state ok", data: Data.chat })
        );
      }
      case "set username": {
        const result = Data.addUser(parsed.data);
        return socket.send(
          JSON.stringify({
            type: `set username ${result ? "ok" : "not ok"}`,
            data: Data.users,
          })
        );
      }
    }
  });
});

// Starting the server
server.listen(port, () =>
  console.log(`Draw.online backend started at port ${port}`)
);
