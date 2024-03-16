"use client";

import { useState, useEffect, useContext } from "react";
import { getProduct } from "@/apiqueries/apiqueries";
import { Image, Button, useDisclosure } from "@nextui-org/react";
import { originalPathname } from "next/dist/build/templates/app-page";
import { motion, AnimatePresence, wrap } from "framer-motion";
import Loading from "@/app/components/Loading";
import data from "@/data.json";
import { CartContext } from "@/app/providers";
import Lightbox from "@/app/components/Lightbox";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  images: string[];
  thumbnails: string[];
  discount: number;
  currentPrice: number;
}

type CartItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
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

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function Page({ params }: { params: { slug: string } }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { cart, addToCart } = useContext(CartContext);
  const [data, setData] = useState<Product | undefined>();
  const [quantity, setQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [[page, direction], setPage] = useState([0, 0]);
  const imageIndex = wrap(0, data?.images.length ?? 0, page);

  const item: CartItem = {
    id: data?.id ?? 0,
    name: data?.name ?? "",
    quantity: quantity,
    price: data?.currentPrice ?? 0,
    image: data?.thumbnails[0] ?? "",
  };

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apidata = await getProduct(params.slug);
        const currentPrice = apidata.price * apidata.discount;
        setData({ ...apidata, currentPrice });
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [params.slug]);
  const addHandler = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const minusHandler = () => {
    setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 0));
  };

  return (
    <main className="container mx-auto flex h-[100dvh] min-h-screen w-full min-w-[375px] overflow-auto transition-all duration-300 ease-in-out">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Lightbox data={data} isOpen={isOpen} onOpenChange={onOpenChange} />

          <div className="flex h-full w-full flex-col gap-5 transition-all duration-300 ease-in-out md:flex-row md:gap-20">
            <div className="flex h-full w-full flex-col gap-7 transition-all duration-300 ease-in-out md:items-center md:justify-center md:py-28 xl:px-10">
              <div className="flex h-full w-full transition-all duration-300 ease-in-out md:items-center md:justify-center">
                <div className="relative flex h-full w-full items-center overflow-hidden object-cover transition-all duration-300 ease-in-out md:rounded-md">
                  <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                      onClick={onOpen}
                      className="absolute overflow-hidden md:rounded-lg"
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
                    className="next absolute right-5 top-1/2 z-10 flex h-12 w-12 min-w-0 md:hidden"
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
                    className="prev absolute left-5 top-1/2 z-10 flex h-12 w-12 min-w-0 md:hidden"
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
              </div>
              <div className="hidden gap-7 md:flex">
                {data?.images.map((image, index) => {
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        const newDirection = index > page ? 1 : -1;
                        setPage([index, newDirection]);
                      }}
                      className={`overflow-hidden rounded-lg border-3 ${index === page ? ` border-primary-orange` : `border-neutral-white dark:border-neutral-black`}`}
                    >
                      <Image
                        src={`/${data?.thumbnails[index]}`}
                        width={1000}
                        radius="none"
                        alt={`${data?.thumbnails[index]}-image`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex h-full w-full flex-col gap-5 px-5 transition-all duration-300 ease-in-out md:justify-center md:gap-9 md:px-0">
              <div className="flex flex-col gap-2 transition-all duration-300 ease-in-out md:gap-5">
                <div className="text-sm font-semibold tracking-widest text-primary-orange transition-all duration-300 ease-in-out">
                  SNEAKER COMPANY
                </div>
                <div className="text-3xl font-bold md:text-5xl">
                  {data?.name}
                </div>
              </div>
              <div className="text-small leading-loose text-neutral-dark-grayish-blue">
                {data?.description}
              </div>
              <div className="flex w-full justify-between md:flex-col">
                <div className="flex items-center gap-5">
                  <div className="text-3xl font-bold">
                    ${data?.currentPrice.toFixed(2)}
                  </div>
                  <div className="rounded-sm bg-primary-pale-orange px-2 text-small font-bold text-primary-orange">
                    {data?.discount ? data.discount * 100 : 0}%
                  </div>
                </div>
                <div className="flex items-center text-small font-bold text-neutral-dark-grayish-blue line-through">
                  ${data?.price.toFixed(2)}.00
                </div>
              </div>
              <div className="flex w-full flex-col gap-5 md:flex-row">
                <div className="flex w-full items-center justify-between md:w-2/5 ">
                  <Button onPress={minusHandler} className="bg-inherit">
                    <Image src={`/images/icon-minus.svg`} />
                  </Button>
                  <div className="flex items-center justify-center font-bold">
                    {quantity}
                  </div>

                  <Button onPress={addHandler} className="bg-inherit">
                    <Image src={`/images/icon-plus.svg`} />
                  </Button>
                </div>
                <Button
                  onPress={() => {
                    addToCart(item);
                  }}
                  className="flex h-12 w-full font-bold text-neutral-white md:w-2/5 "
                  color="primary"
                >
                  <div>
                    <svg
                      width="22"
                      height="20"
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-neutral-white"
                    >
                      <path d="M20.925 3.641H3.863L3.61.816A.896.896 0 0 0 2.717 0H.897a.896.896 0 1 0 0 1.792h1l1.031 11.483c.073.828.52 1.726 1.291 2.336C2.83 17.385 4.099 20 6.359 20c1.875 0 3.197-1.87 2.554-3.642h4.905c-.642 1.77.677 3.642 2.555 3.642a2.72 2.72 0 0 0 2.717-2.717 2.72 2.72 0 0 0-2.717-2.717H6.365c-.681 0-1.274-.41-1.53-1.009l14.321-.842a.896.896 0 0 0 .817-.677l1.821-7.283a.897.897 0 0 0-.87-1.114ZM6.358 18.208a.926.926 0 0 1 0-1.85.926.926 0 0 1 0 1.85Zm10.015 0a.926.926 0 0 1 0-1.85.926.926 0 0 1 0 1.85Zm2.021-7.243-13.8.81-.57-6.341h15.753l-1.383 5.53Z" />
                    </svg>
                  </div>
                  <div> Add to Cart</div>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
