export type Request = {
  method: string;
  path: string;
  version: string;
  headers: {
    [key: string]: string;
  };
  body: Buffer;
};

export type Response = {
  status: number;
  message: string;
  headers: {
    [key: string]: string;
  };
  body: Buffer;
};

export type Message = {
  request: Request;
  response: Response;
};

export type Env = {
  www: string;
  template: string;
  session: string;
};
