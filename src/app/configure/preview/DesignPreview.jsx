"use client";
import { COLORS, MODELS } from "../../validators/option-validator";
import Phone from "../../../components/Phone";
import { ArrowRight, Check } from "lucide-react";
import React, { useState } from "react";
import { BASE_PRICE, PRODUCT_PRICES } from "../../config/products";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { createCheckoutSession } from "./action";
import { useRouter } from "next/navigation";
import LoginModal from "../../../components/LoginModal";
const DesignPreview = ({ configuration }) => {
  const { color, model, finish, material, croppedImageUrl } = configuration;
  const tw = COLORS.find(
    (supportedColor) => supportedColor.value === color
  )?.tw;
  const { user } = useKindeBrowserClient();
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  let totalPrice = BASE_PRICE;
  const { _id } = configuration;
  if (material === "polycarbonate")
    totalPrice += PRODUCT_PRICES.material.polycarbonate;
  if (finish === "textured") totalPrice += PRODUCT_PRICES.finish.textured;
  const { label: modelLabel } = MODELS.options.find(
    ({ value }) => value === model
  );
  console.log("check", user);
  const handleCheckout = async () => {
    if (user) {
      const { url } = await createCheckoutSession({
        configId: _id,
        total: totalPrice,
      });
      if (url) router.push(url);
      else throw new Error("An error ocurred created checkout url");
    } else {
      localStorage.setItem("configurationId", _id);
      setIsLoginModalOpen(true);
    }
  };
  return (
    <div>
      <div className="mt-20 flex flex-col items-center md:grid text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12">
        <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />
        <div className="md:col-span-4 lg:col-span-3 md:row-span-2 md:row-end-2 h-full">
          <div className="md:col-span-4 lg:col-span-3 md:row-span-2 md:row-end-2">
            <Phone className={`bg-${tw} w-[200px] `} imgSrc={croppedImageUrl} />
          </div>
        </div>

        <div className="mt-6 sm:col-span-9 md:row-end-1">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">
            Your {modelLabel} Case
          </h3>
          <div className="mt-3 flex items-center gap-1.5 text-base">
            <Check className="h-4 w-4 text-green-500" />
            In stock and ready to ship
          </div>
        </div>

        <div className="sm:col-span-12 md:col-span-9 text-base">
          <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
            <div>
              <p className="font-medium text-zinc-950">Highlights</p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside">
                <li>Wireless charging compatible</li>
                <li>TPU shock absorption</li>
                <li>Packaging made from recycled materials</li>
                <li>5 year print warranty</li>
              </ol>
            </div>
            <div>
              <p className="font-medium text-zinc-950">Materials</p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside">
                <li>High-quality, durable material</li>
                <li>Scratch- and fingerprint resistant coating</li>
              </ol>
            </div>
          </div>

          <div className="mt-8">
            <div className="bg-gray-50 p-6 sm:rounded-lg sm:p-8">
              <div className="flow-root text-sm">
                <div className="flex items-center justify-between py-1 mt-2">
                  <p className="text-gray-600">Base price</p>
                  <p className="font-medium text-gray-900">{BASE_PRICE} $</p>
                </div>

                {finish === "textured" ? (
                  <div className="flex items-center justify-between py-1 mt-2">
                    <p className="text-gray-600">Textured finish</p>
                    <p className="font-medium text-gray-900">
                      {PRODUCT_PRICES.finish.textured} $
                    </p>
                  </div>
                ) : null}

                {material === "polycarbonate" ? (
                  <div className="flex items-center justify-between py-1 mt-2">
                    <p className="text-gray-600">Soft polycarbonate material</p>
                    <p className="font-medium text-gray-900">
                      {PRODUCT_PRICES.material.polycarbonate} $
                    </p>
                  </div>
                ) : null}

                <div className="my-2 h-px bg-gray-200" />

                <div className="flex items-center justify-between py-2">
                  <p className="font-semibold text-gray-900">Order total</p>
                  <p className="font-semibold text-gray-900">{totalPrice} $</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end pb-12">
              <button
                onClick={() => handleCheckout()}
                className="px-4 sm:px-6 lg:px-8"
              >
                Check out <ArrowRight className="h-4 w-4 ml-1.5 inline" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignPreview;
