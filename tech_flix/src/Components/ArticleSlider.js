import React, { Component } from "react";
import Slider from "react-slick";
import Article from "./Article"

export default class ArticleSlider extends Component {
  render() {
    const settings = {
      dots: false,
      infinite: true,
      speed: 1000,
      slidesToShow: 5,
      slidesToScroll: 5,
      responsive: [
        {
          breakpoint: 1280,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 4,
            infinite: true,
          }
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    }

    return (
      <div>
        <Slider {...settings}>
          <div>
            <Article />
          </div>
          <div>
            <Article />
          </div>
          <div>
            <Article />
          </div>
          <div>
            <Article />
          </div>
          <div>
            <Article />
          </div>
          <div>
            <Article />
          </div>
          <div>
            <Article />
          </div>
          <div>
            <Article />
          </div>
          <div>
            <Article />
          </div>
          <div>
            <Article />
          </div>
        </Slider>
      </div>
    );
  }
}