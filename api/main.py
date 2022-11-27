import uvicorn
import settings
from fastapi import FastAPI
from socketio import ASGIApp
from fastapi.responses import JSONResponse
from starlette.routing import Mount, Router
from sockfest import sock
from router import api

sock_app = ASGIApp(sock)
app = FastAPI(
    title="Blue Quartz API",
    version=settings.VERSION,
    # routes = [
    #     Mount('/sock', sock_app),
    # ]
)

# Catch 404
@app.exception_handler(404)
async def http_exception_handler(request, exc) -> JSONResponse:
    return JSONResponse(status_code=404, content={"code": 404, "message": "not-found"})

# Mount API router
app.include_router(api)

# Mount SocketIO router (legacy method)
app.mount('/', sock_app)

if __name__ == "__main__":
    uvicorn.run(
        app,
        host=settings.HOST,
        port=settings.PORT,
        headers = [("server", f"blue-quartz/{settings.VERSION}")]
    )