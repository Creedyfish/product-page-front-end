import React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, wrap } from "framer-motion";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Image,
} from "@nextui-org/react";

interface ModalStates {
  isOpen: boolean;
  onOpenChange: () => void;
  data: any;
}

export default function Lightbox({ isOpen, onOpenChange, data }: ModalStates) {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const imageIndex = wrap(0, data?.images.length ?? 0, page);
  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };
  return (
    <>
      {!isMobile && (
        <Modal
          isDismissable={false}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          className="overflow-hidden bg-transparent shadow-none"
          size="2xl"
          closeButton={
            <div className="">
              <svg
                width="14"
                height="15"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-primary-orange"
              >
                <path d="m11.596.782 2.122 2.122L9.12 7.499l4.597 4.597-2.122 2.122L7 9.62l-4.595 4.597-2.122-2.122L4.878 7.5.282 2.904 2.404.782l4.595 4.596L11.596.782Z" />
              </svg>
            </div>
          }
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody>
                  <div className="flex flex-col items-center gap-5 overflow-hidden p-10 transition-all duration-300 ease-in-out md:rounded-md">
                    <div className="relative">
                      <AnimatePresence
                        initial={false}
                        mode="popLayout"
                        custom={direction}
                      >
                        <motion.div
                          className="relative flex h-1/2 w-full items-center justify-center overflow-hidden object-contain md:rounded-lg"
                          key={page}
                          custom={direction}
                          variants={variants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                          }}
                          drag="x"
                          dragConstraints={{ left: 0, right: 0 }}
                          dragElastic={1}
                          onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);

                            if (swipe < -swipeConfidenceThreshold) {
                              paginate(1);
                            } else if (swipe > swipeConfidenceThreshold) {
                              paginate(-1);
                            }
                          }}
                        >
                          <Image
                            src={`/${data?.images[imageIndex]}`}
                            radius="none"
                            className=""
                            alt={`${data?.images[imageIndex]}-image`}
                          />
                        </motion.div>
                      </AnimatePresence>
                      <Button
                        className="next absolute -right-7 top-1/2 z-10 flex h-12 w-12 min-w-0 "
                        radius="full"
                        onClick={() => paginate(1)}
                      >
                        <svg
                          width="13"
                          height="18"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="m2 1 8 8-8 8"
                            stroke="#1D2026"
                            strokeWidth="3"
                            fill="none"
                            fillRule="evenodd"
                          />
                        </svg>
                      </Button>
                      <Button
                        className="prev absolute -left-7 top-1/2 z-10 flex h-12 w-12 min-w-0"
                        onClick={() => paginate(-1)}
                        radius="full"
                      >
                        <svg
                          width="12"
                          height="18"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11 1 3 9l8 8"
                            stroke="#1D2026"
                            strokeWidth="3"
                            fill="none"
                            fillRule="evenodd"
                          />
                        </svg>
                      </Button>
                    </div>

                    <div className="h-full gap-7 md:flex">
                      {data?.images.map((image: string, index: number) => {
                        return (
                          <button
                            key={index}
                            onClick={() => {
                              const newDirection = index > page ? 1 : -1;
                              setPage([index, newDirection]);
                            }}
                            className={`overflow-hidden rounded-lg border-3 ${index === page ? ` border-primary-orange` : `border-transparent dark:border-neutral-black`}`}
                          >
                            <Image
                              src={`/${image}`}
                              width={1000}
                              radius="none"
                              alt={`${image}-image`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
