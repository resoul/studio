import { Configuration, FrontendApi } from '@ory/client';

const { VITE_KRATOS_PUBLIC_URL } = import.meta.env;

export const kratos = new FrontendApi(
    new Configuration({
        basePath: VITE_KRATOS_PUBLIC_URL,
        baseOptions: {
            withCredentials: true,
        },
    })
);
