// a mock route validation class
class Router {
  constructor() {
    this.routes = ["/"];
  }

  isValidPath(path) {
    return new Promise((resolve, reject) => {
      try {
        if (this.routes.includes(path)) {
          resolve(true);
        }
        resolve(false);
      } catch {
        reject();
      }
    });
  }
}

export default Router;
