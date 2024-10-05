"use client";
import React, { useRef, useState } from "react";
import NextImage from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Rnd } from "react-rnd";
import HandleComponent from "./HandleComponent";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Radio, RadioGroup } from "@headlessui/react";
import { Label } from "@/components/ui/label";
import {
  COLORS,
  FINISHES,
  MATERIALS,
  MODELS,
} from "../../validators/option-validator";
import { ArrowRight, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BASE_PRICE } from "../../config/products";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRouter, useSearchParams } from "next/navigation";
const DesignConfigurator = ({ imageDimensions }, {}) => {
  const [options, setOptions] = useState({
    color: COLORS[0],
    model: MODELS.options[0],
    material: MATERIALS.options[0],
    finish: FINISHES.options[0],
  });
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  console.log(options);
  const [uploading, setUploading] = useState(false);
  const [renderedDimension, setRenderedDimension] = useState({
    width: imageDimensions.width / 4,
    height: imageDimensions.height / 4,
  });
  const router = useRouter();
  const [renderedPosition, setRenderedPosition] = useState({
    x: 150,
    y: 205,
  });

  const phoneCaseRef = useRef(null);
  const containerRef = useRef(null);

  const handleUpload = async (acceptedFiles) => {
    console.log("uploading");
    setUploading(true);
    const data = new FormData();
    data.append("file", acceptedFiles);
    data.append("upload_preset", "phoneecomm");
    data.append("cloud_name", "dlol3hguo ");

    fetch(process.env.NEXT_PUBLIC_CLOUDINARY_API, {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.public_id) {
          await fetch("/api/updatecroppedimg", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              imageUrl: `https://res.cloudinary.com/dlol3hguo/image/upload/v1726918664/${data.public_id}.png`,
              id: id,
              color: options.color.value,
              model: options.model.value,
              material: options.material.value,
              finish: options.finish.value,
            }),
          });
        }
        setUploading(false);

        router.push(`/configure/preview?id=${id}`);
      })
      .catch((err) => {
        setUploading(false);
        console.log(err);
      });
  };

  async function saveConfiguration() {
    console.log("save config");
    try {
      const {
        left: caseLeft,
        top: caseTop,
        width,
        height,
      } = phoneCaseRef.current.getBoundingClientRect();

      const { left: containerLeft, top: containerTop } =
        containerRef.current.getBoundingClientRect();

      const leftOffset = caseLeft - containerLeft;
      const topOffset = caseTop - containerTop;

      const actualX = renderedPosition.x - leftOffset;
      const actualY = renderedPosition.y - topOffset;
      console.log("caseleft", caseLeft);
      console.log("conleft", containerLeft);
      console.log("renderedPosition.x ", renderedPosition.x);
      console.log("act", actualX);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      const userImage = new Image();
      userImage.crossOrigin = "anonymous";
      userImage.src = imageUrl;
      await new Promise((resolve) => (userImage.onload = resolve));

      ctx?.drawImage(
        userImage,
        actualX,
        actualY,
        renderedDimension.width,
        renderedDimension.height
      );

      const base64 = canvas.toDataURL();
      const base64Data = base64.split(",")[1];

      const blob = base64ToBlob(base64Data, "image/png");
      const file = new File([blob], "filename.png", { type: "image/png" });
      console.log(blob);
      await handleUpload(file);
    } catch (err) {
      console.log(err);
    }
  }

  function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }
  return (
    <div className="overflow-hidden relative grid grid-cols-1 lg:grid-cols-2">
      <div
        ref={containerRef}
        className="h-[37.5rem] relative flex items-center justify-center overflow-hidden  w-full max-w-4xl rounded-lg border-2 border-dashed "
      >
        <div className="relative w-60 aspect-[896/1831]">
          <AspectRatio
            ref={phoneCaseRef}
            ratio={896 / 1831}
            className="pointer-events-none overflow-hidden relative z-50 aspect-[896/1831] w-full"
          >
            <NextImage
              fill
              alt="phone image"
              src="/phone-template.png"
              className="pointer-events-none z-50 select-none"
            />
          </AspectRatio>
          <div className="absolute z-40 inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]" />
          <div
            className={`absolute inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px]    bg-${options.color.tw}`}
          />
        </div>
        <Rnd
          default={{
            x: 150,
            y: 205,
            height: imageDimensions.height / 4,
            width: imageDimensions.width / 4,
          }}
          onResizeStop={(_, __, ref, ___, { x, y }) => {
            setRenderedDimension({
              height: parseInt(ref.style.height.slice(0, -2)),
              width: parseInt(ref.style.width.slice(0, -2)),
            });

            setRenderedPosition({ x, y });
          }}
          onDragStop={(_, data) => {
            const { x, y } = data;
            setRenderedPosition({ x, y });
          }}
          className="absolute z-20  border-[3px] border-primary"
          lockAspectRatio
          resizeHandleComponent={{
            bottomRight: <HandleComponent />,
            bottomLeft: <HandleComponent />,
            topRight: <HandleComponent />,
            topLeft: <HandleComponent />,
          }}
        >
          <div className="relative w-full  h-full">
            <NextImage
              src={imageUrl}
              fill
              alt="your image"
              className="pointer-events-none"
            />
          </div>
        </Rnd>
      </div>
      <div className="h-[37.5rem] w-full col-span-full lg:col-span-1 flex flex-col bg-white">
        <ScrollArea className="relative flex-1 overflow-auto">
          <div
            aria-hidden="true"
            className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
          />

          <div className="px-8 pb-12 pt-8">
            <h2 className="tracking-tight font-bold text-3xl">
              Customize your case
            </h2>

            <div className="w-full h-px bg-zinc-200 my-6" />

            <div className="relative mt-4 h-full flex flex-col justify-between">
              <div className="flex flex-col gap-6">
                <RadioGroup
                  value={options.color}
                  onChange={(val) => {
                    setOptions((prev) => ({
                      ...prev,
                      color: val,
                    }));
                  }}
                >
                  <Label>Color: {options.color.label}</Label>
                  <div className="mt-3 flex items-center space-x-3">
                    {COLORS.map((color) => (
                      <RadioGroup.Option
                        key={color.label}
                        value={color}
                        className={({ active, checked }) =>
                          `relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent ${
                            active || checked ? `border-${color.tw}` : ""
                          }`
                        }
                      >
                        <span
                          className={`bg-${color.tw} h-8 w-8 rounded-full border border-black border-opacity-10`}
                        />
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
                <div className="relative flex flex-col gap-3 w-full">
                  <Label>Model</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {options.model.label}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {MODELS.options.map((model) => (
                        <DropdownMenuItem
                          key={model.label}
                          className={`flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100  ${
                            model.label === options.model.label
                              ? "bg-zinc-100"
                              : ""
                          }`}
                          onClick={() => {
                            setOptions((prev) => ({ ...prev, model }));
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              model.label === options.model.label
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                          {model.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {[MATERIALS, FINISHES].map(
                  ({ name, options: selectableOptions }) => (
                    <RadioGroup
                      key={name}
                      value={options[name]}
                      onChange={(val) => {
                        setOptions((prev) => ({
                          ...prev,
                          [name]: val,
                        }));
                      }}
                    >
                      <Label>
                        {name.slice(0, 1).toUpperCase() + name.slice(1)}
                      </Label>
                      <div className="mt-3 space-y-4">
                        {selectableOptions.map((option) => (
                          <RadioGroup.Option
                            key={option.value}
                            value={option}
                            className={({ active, checked }) =>
                              `relative block cursor-pointer rounded-lg bg-white px-6 py-4 shadow-sm border-2 border-zinc-200 focus:outline-none ring-0 focus:ring-0 outline-none sm:flex sm:justify-between ${
                                active || checked ? "border-green-700" : ""
                              }`
                            }
                          >
                            <span className="flex items-center">
                              <span className="flex flex-col text-sm">
                                <RadioGroup.Label
                                  className="font-medium text-gray-900"
                                  as="span"
                                >
                                  {option.label}
                                </RadioGroup.Label>

                                {option.description ? (
                                  <RadioGroup.Description
                                    as="span"
                                    className="text-gray-500"
                                  >
                                    <span className="block sm:inline">
                                      {option.description}
                                    </span>
                                  </RadioGroup.Description>
                                ) : null}
                              </span>
                            </span>

                            <RadioGroup.Description
                              as="span"
                              className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right"
                            >
                              <span className="font-medium text-gray-900">
                                {option.price}$
                              </span>
                            </RadioGroup.Description>
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  )
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="w-full px-8 h-16 bg-white">
          <div className="h-px w-full bg-zinc-200" />
          <div className="w-full h-full flex justify-end items-center">
            <div className="w-full flex gap-6 items-center">
              <p className="font-medium whitespace-nowrap">
                {BASE_PRICE + options.finish.price + options.material.price}$
              </p>
              <Button
                onClick={() => saveConfiguration()}
                size="sm"
                className="w-full"
              >
                {uploading ? "uploading" : "Continue"}

                <ArrowRight className="h-4 w-4 ml-1.5 inline" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignConfigurator;
