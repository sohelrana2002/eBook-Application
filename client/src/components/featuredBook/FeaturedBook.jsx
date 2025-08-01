"use client";

import "./FeaturedBook.css";
import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper/modules";
import BookCard from "../bookCard/BookCard";
import Link from "next/link";

const FeaturedBook = ({ allFeaturedBook }) => {
  //   console.log("allFeaturedBook", allFeaturedBook);

  return (
    <div className="conatiner featuredbook__container">
      {/* oscar__book  */}
      <div className="oscar__book">
        <h1 className="heading">Oscar Winner Books</h1>
        <Swiper
          slidesPerView={4}
          centeredSlides={false}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            320: { slidesPerView: 1 },
            671: { slidesPerView: 2 },
            890: { slidesPerView: 3 },
            1300: { slidesPerView: 4 },
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {allFeaturedBook &&
            allFeaturedBook?.oscarBook?.map((curElem) => {
              return (
                <SwiperSlide className="swiper_slide">
                  <Link key={curElem._id} href={`/books/${curElem.slug}`}>
                    <BookCard {...curElem} />
                  </Link>
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>

      {/* novel */}
      <div className="oscar__book">
        <h1 className="heading">Novel Books</h1>
        <Swiper
          slidesPerView={4}
          centeredSlides={false}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            320: { slidesPerView: 1 },
            671: { slidesPerView: 2 },
            890: { slidesPerView: 3 },
            1300: { slidesPerView: 4 },
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {allFeaturedBook &&
            allFeaturedBook?.novelBook?.map((curElem) => {
              return (
                <SwiperSlide>
                  <Link key={curElem._id} href={`/books/${curElem.slug}`}>
                    <BookCard {...curElem} />
                  </Link>
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>

      {/* shortStoryBook  */}
      <div className="oscar__book">
        <h1 className="heading">Short Story Books</h1>
        <Swiper
          slidesPerView={4}
          centeredSlides={false}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            320: { slidesPerView: 1 },
            671: { slidesPerView: 2 },
            890: { slidesPerView: 3 },
            1300: { slidesPerView: 4 },
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {allFeaturedBook &&
            allFeaturedBook?.shortStoryBook?.map((curElem) => {
              return (
                <SwiperSlide>
                  <Link key={curElem._id} href={`/books/${curElem.slug}`}>
                    <BookCard {...curElem} />
                  </Link>
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>

      {/* poetryBook  */}
      <div className="oscar__book">
        <h1 className="heading">Poetry Books</h1>
        <Swiper
          slidesPerView={4}
          centeredSlides={false}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            320: { slidesPerView: 1 },
            671: { slidesPerView: 2 },
            890: { slidesPerView: 3 },
            1300: { slidesPerView: 4 },
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {allFeaturedBook &&
            allFeaturedBook?.poetryBook?.map((curElem) => {
              return (
                <SwiperSlide>
                  <Link key={curElem._id} href={`/books/${curElem.slug}`}>
                    <BookCard {...curElem} />
                  </Link>
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>

      {/* kidsBook */}
      <div className="oscar__book">
        <h1 className="heading">Kids Books</h1>
        <Swiper
          slidesPerView={4}
          centeredSlides={false}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            320: { slidesPerView: 1 },
            671: { slidesPerView: 2 },
            890: { slidesPerView: 3 },
            1300: { slidesPerView: 4 },
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {allFeaturedBook &&
            allFeaturedBook?.kidsBook?.map((curElem) => {
              return (
                <SwiperSlide>
                  <Link key={curElem._id} href={`/books/${curElem.slug}`}>
                    <BookCard {...curElem} />
                  </Link>
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>
    </div>
  );
};

export default FeaturedBook;
