import { useEffect, useState } from "react";
import axios from "axios";

const useCurrentUser = () => {
  const [user, setUser] = useState();
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const currentUser = await axios.get("/api/current");

      setUser(currentUser.data);
    };

    fetchCurrentUser();
  }, []);

  return { user };
};

export default useCurrentUser;
