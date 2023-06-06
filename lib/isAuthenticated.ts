import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "@/pages/api/auth/[...nextauth]";

export const requireAuthentication = (gssp: GetServerSideProps) => {
  return async (ctx: GetServerSidePropsContext) => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions);
    if (!session && ctx.resolvedUrl != "/auth") {
      //if user is not authenticated you cannot redirect to authenticated content
      return {
        redirect: {
          permanent: false,
          destination: "/auth",
        },
      };
    }

    if (session && ctx.resolvedUrl == "/auth") {
      //if user is trying to redirect to login page after logging in, push him to home page
      return {
        redirect: {
          permanent: false,
          destination: "/",
        },
      };
    }

    return await gssp(ctx);
  };
};
