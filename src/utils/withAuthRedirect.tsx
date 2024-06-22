import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import log from "@/utils/clientLogger";

const withAuthRedirect = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const Wrapper = (props: P) => {
    const router = useRouter();
    const { session } = useSession();

    useEffect(() => {
      log.debug("Checking session in withAuthRedirect:", session);
      if (session) {
        log.info("Session exists, redirecting to home");
        router.push("/"); // Redirect to home if session exists
      }
    }, [session, router]);

    // If session exists, avoid rendering the component during the redirect
    if (session) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuthRedirect;
