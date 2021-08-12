import init, { greet } from "./pkg/hello_wasm.js";

await init(Deno.readFile("./pkg/hello_wasm_bg.wasm"));

const server = Deno.listen({ port: 8000 });

for await (const conn of server) {
    handle(conn);
}

async function handle(conn: Deno.Conn) {
    const httpConn = Deno.serveHttp(conn);

    for await (const requestEvent of httpConn) {
        requestEvent.respondWith(new Response(
            greet("World"), {
                status: 200,
                headers: {
                    "content-type": "text/html",
                }
            }
        ));
    }
}
