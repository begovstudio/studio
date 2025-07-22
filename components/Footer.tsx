"use client";

import NewsletterTicker from "./NewsletterTicker";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import FooterSocialLinks from "./FooterSocialsLinks";
import NewsletterSignUp from "./NewsletterSignUp";

export default function Footer() {
  return (
    <footer className="bg-black overflow-hidden">
      <NewsletterTicker />
      <div className="max-w-[95rem] mx-auto px-6">
        <div className="py-8 xl:py-[128px] grid grid-cols-1 2xl:grid-cols-2 gap-2 md:gap-12 xl:gap-32 items-center">
          <h2 className="uppercase text-footer-title">
            Новости дизайна на вашу почту
          </h2>
          <div className="flex flex-wrap lg:justify-end gap-3">
            <NewsletterSignUp
              formClassName="flex flex-col gap-4 max-w-[28rem] w-full"
              formFieldsClassName="flex flex-wrap gap-3"
              inputClassName="max-w-[20rem]"
              buttonClassName="bg-white text-black hover:text-white"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row flex-wrap lg:justify-between gap-6 max-w-[95rem] w-full">
        <img
              className="h-full w-fit"
              src="/logos/FyrreMagazineFavicon-White.svg"
              alt="logo"
            />

          <div className="flex lg:flex-row max-w-[63.125rem] w-full">
         
            <nav className="flex flex-1" aria-label="middle-footer-links">
              <ul className="text-white space-y-3">
                <li>
                  <Link href="/magazine">Портфолио</Link>
                </li>
                <li>
                  <Link href="/services">Авторы</Link>
                </li>
                 <li>
                  <Link href="/authors">Авторы</Link>
                </li>
              </ul>
            </nav>
            <nav className="flex flex-1" aria-label="right-footer-links">
              <ul className="text-white space-y-3">
                <li>
                  <a href="/brief">Бриф</a>
                </li>
                <li>
                  <a href="#">Проверить домен</a>
                </li>
               
              </ul>
            </nav>
          </div>
        </div>
        <div className="flex flex-wrap flex-col md:flex-row justify-between gap-6 py-3 lg:pt-[6rem] lg:pb-[4.0625rem] w-full">
          <p className="font-regular text-white">
            Дизайн&nbsp;
            <Link href="https://templates.gola.io/templates">Begov Nazim & Ilya Doncov</Link>.
            Разработка Begov Studio.
          </p>
          <FooterSocialLinks />
        </div>
      </div>
    </footer>
  );
}
