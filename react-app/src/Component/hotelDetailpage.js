import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook,faInstagram,faTwitter} from '@fortawesome/free-brands-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import '../css/home.css'
export default function HotelDetailPage(){
    return(
        <div className=' hotel_detail_page w-full  bg-black flex flex-col  items-center gap-8 border border-yellow-300' >
        <div className=' text-white text-4xl flex  gap-4 mt-8 '  > 
           
           <a href='https://www.facebook.com/FourSeasonsHotelNewYorkDowntown' target='_blank' rel='noopener noreferrer'>
            <p className=' hover:text-slate-500'> <FontAwesomeIcon icon={faFacebook}/></p>
           </a> 
            <a href='https://twitter.com/search?q=Go%20to%20the%20Four%20Seasons%20home%20page%20FOUR%20SEASONS%20HOTEL%20NEW%20YORK%20DOWNTOWN&src=typed_query&f=live' target="_blank" rel="noopener noreferrer">
                <p className=' hover:text-slate-500'><FontAwesomeIcon icon={faTwitter} /></p>
            </a>
            <a href='https://www.instagram.com/fsnewyork/' target="_blank" rel="noopener noreferrer">
                <p className=' hover:text-slate-500'><FontAwesomeIcon icon={faInstagram}/></p>
            </a>
            <p className=' hover:text-slate-500'><FontAwesomeIcon icon={faPhone}/></p>

        </div>
        <div className='text-white font-serif  text-lg  hover:text-slate-500 mb-8' style={{width:'90%',fontWeight:'inherit'}}>
        Discover unmatched luxury and sophistication at Four Seasons Hotel New York Downtown. Located in the dynamic Tribeca neighbourhood, our accommodations redefine urban elegance. From sleek suites with panoramic views to stylish guest rooms, each space offers a haven of comfort and refinement, ensuring an unforgettable stay in lower Manhattan.
        </div>
        </div>
    )
}