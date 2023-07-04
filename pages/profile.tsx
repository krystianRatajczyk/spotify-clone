import React, { useContext, useEffect, useRef, useState } from "react";
import { GetServerSideProps } from "next";
import { requireAuthentication } from "@/lib/isAuthenticated";
import { GoPerson } from "react-icons/go";
import { HiOutlinePencil } from "react-icons/hi";
import { BeatLoader } from "react-spinners";
import useHover from "@/hooks/useHover";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import Button from "@/components/Layout/Button";
import { checkImageExists } from "@/lib/checkImageExists";
import axios from "axios";
import Notification from "@/components/Notification";
import {
  errorType,
  notificationState,
  profileErrorState,
} from "@/constants/initialStates";
import Picture from "@/components/Picture";
import { UserContext } from "@/context/UserContext";

const Profile = () => {
  const { state: user, dispatch } = useContext(UserContext);

  const divRef = useRef<HTMLDivElement>(null);
  const [isHover] = useHover(divRef);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>(user.name);
  const [url, setUrl] = useState<string>("");

  const [inputNameActive, setInputNameActive] = useState<boolean>(false);
  const [inputImageActive, setInputImageActive] = useState<boolean>(false);
  const [error, setError] = useState<errorType>(profileErrorState);

  const [notification, setNotification] =
    useState<notificationState>(notificationState);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    // when closing modal manually means no api call was made
    setIsModalOpen(false);
    setUrl("");
    setError(profileErrorState);
    setNewName(user.name);
  };

  useEffect(() => {
    setNewName(user.name);
  }, [user]);

  useEffect(() => {
    setError((prevState) => {
      return { ...prevState, name: newName == "" };
    });
  }, [newName]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const check = async () => {
        try {
          const res = await checkImageExists(url);
          setError((prevState) => {
            return { ...prevState, url: { value: !res, message: "" } };
          });
        } catch (error: any) {
          setError((prevState) => {
            return {
              ...prevState,
              url: { value: true, message: error.message },
            };
          });
        }
      };

      if (url != "" && url == imageInputRef.current?.value) check();
    }, 400);

    return () => clearTimeout(timeout);
  }, [url, imageInputRef.current?.value]);

  const onAction = (action: string) => {
    if (url == "" && action == "save") {
      setError((prevState) => {
        return { ...prevState, url: { value: true, message: "" } };
      });
      return;
    }
    if (!error.name && !error.url.value) {
      //api call
      axios
        .post("/api/changeProfile", {
          newName,
          url: action == "save" ? url : "",
          user,
          action,
        })
        .then((res) => {
          if (res.statusText && res.statusText == "OK") {
            dispatch({ type: "CHANGE_PROFILE", payload: res.data.update });
            setNotification({ message: res.data.message, color: "bg-blue" });
            setNewName(res.data.update.name);
            closeModal();
          }
        })
        .catch((err) => {
          console.log(err)
          setNotification(err.response.data.message);
          setNotification({
            message: err.response.data.message,
            color: "bg-red-600",
          });

          closeModal();
        });
    }
  };

  return (
    <div className="flex-1 bg-darkGray flex flex-col">
      {notification.message && (
        <Notification
          message={notification.message}
          setNotification={setNotification}
          color={notification.color}
        />
      )}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Profile details">
        <div className="flex gap-5 items-center mt-3">
          <Picture>
            {url != "" && !error.url.value ? (
              <img src={url} className="object-cover h-full w-full" />
            ) : (
              <GoPerson size={60} color="#B3B3B3" />
            )}
          </Picture>
          <div>
            <div className="flex flex-col gap-3 w-[300px]">
              <div className="relative">
                {inputNameActive && (
                  <p className="absolute -top-[8px] left-3 text-lightGray z-[100] font-semibold text-sm">
                    Name
                  </p>
                )}
                <Input
                  type="text"
                  className={`bg-mediumGray w-full ${
                    error.name
                      ? "outline-red-300 outline-[1px]"
                      : "focus:outline-lightGray focus:outline-[1px] "
                  }`}
                  placeholder="Name"
                  state={newName}
                  setstate={setNewName}
                  onFocus={() => {
                    setInputNameActive(true);
                  }}
                  onBlur={() => {
                    setInputNameActive(false);
                  }}
                />
              </div>
              <div className="relative">
                {inputImageActive && (
                  <p className="absolute -top-[8px] left-3 text-lightGray z-[100] font-semibold text-sm">
                    Image
                  </p>
                )}
                <Input
                  type="text"
                  className={`bg-mediumGray w-full ${
                    error.url.value
                      ? "outline-red-300 outline-[1px]"
                      : "focus:outline-lightGray focus:outline-[1px] "
                  }`}
                  placeholder="Image url"
                  state={url}
                  setstate={setUrl}
                  onFocus={() => {
                    setInputImageActive(true);
                  }}
                  onBlur={() => {
                    setInputImageActive(false);
                  }}
                  ref={imageInputRef}
                />
                {
                  <h2 className="mt-1 font-bold text-red-300">
                    {error.url.message}
                  </h2>
                }
              </div>
            </div>
            <div className="flex gap-3 mt-2 justify-end ">
              <Button
                className="font-bold bg-mediumGray text-white py-2 px-8 hover:drop-shadow-2xl hover:scale-[1.04]"
                onClick={onAction.bind(null, "delete")}
              >
                Delete
              </Button>
              <Button
                className="font-bold py-2 px-8 hover:drop-shadow-2xl hover:scale-[1.04]"
                onClick={onAction.bind(null, "save")}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <div className="p-5 pt-[100px] flex gap-5 items-center bg-gradient-to-b from-[#5e5c5c] to-mediumGray ">
        <Picture
          className="
            min-w-[230px] h-[230px]
            max-w-[230px]"
          ref={divRef}
          onClick={openModal}
        >
          {isHover ? (
            <div className="flex items-center flex-col">
              <HiOutlinePencil size={60} />
              <h3>Choose picture</h3>
            </div>
          ) : !user.image ? (
            <GoPerson size={60} color="B3B3B3" />
          ) : (
            <img src={user.image} className="object-cover w-full h-full" />
          )}
        </Picture>
        <div className="flex  flex-col overflow-hidden">
          <h4 className="font-bold">Profile</h4>
          {user ? (
            <h2 className="text-bold text-white text-[100px] font-bold ">
              {user.name}
            </h2>
          ) : (
            <BeatLoader color="white" />
          )}

          <p className="font-semibold">
            1 followers <span>•</span> 11 following
          </p>
        </div>
      </div>
      <div className="flex-1 bg-gradient-to-b from-[#242424] via-darkGray to-darkGray drop-shadow-md"></div>
    </div>
  );
};

export default Profile;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (_ctx) => {
    return {
      props: {},
    };
  }
);
