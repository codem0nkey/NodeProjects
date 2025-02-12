import React, { Component } from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import Feature from './Feature'
import '../App.css'

export default class FeatureSlider extends Component {
  render() {
    const settings = {
      dots: false,
      infinite: true,
      speed: 1500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      dotClass: 'dotColor'
    };
    return (
        <div>
            <Slider {...settings}>
                <div>
                    <Feature />
                </div>
                <div>
                    <Feature />
                </div>
                <div>
                    <Feature />
                </div>
                <div>
                    <Feature />
                </div>
                <div>
                    <Feature />
                </div>
            </Slider>
        </div>
    );
  }
}