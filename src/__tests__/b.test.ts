import request from 'superwstest';
import wss from '../ws_server/index.ts';

describe('My Server', () => {
  // beforeEach((done) => {
  //   server.listen(0, 'localhost', done);
  // });

  // afterEach((done) => {
  //   server.close(done);
  // });

  it('communicates via websockets', async () => {
    await request(wss)
      .ws('/path/ws')
      .expectText(JSON.stringify('something'))
      // .sendText('foo')
      // .expectText('echo foo')
      // .sendText('abc')
      // .expectText('echo abc')
      .close()
      .expectClosed();
  });
});
