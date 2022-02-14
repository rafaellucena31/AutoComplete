import { useState } from "react";
import Link from 'next/link'

import Autocomplete from '../components/Autocomplete/Autocomplete'


export default function Home() {
  const [inputSelected, setInputSelected] = useState("");
  const [suggestions, setSuggestions] = useState(['Rafael11', 'Maria', 'Marieta', 'Rafael4', 'Rafael5', 'Rafael6', 'Rafael7', 'Rafael8', 'Rafael9', 'Rafael10']);
  const handleInputSelected = (selectedValue) => {
    setInputSelected(selectedValue);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 flex flex-col justify-center relative overflow-hidden sm:py-12">
      <img src="/img/beams.jpg" alt="" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-none" width="1308" />
      <div className="absolute inset-0 bg-[url(/img/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="relative pt-10 pb-8 bg-white shadow-xl ring-1 ring-gray-900/5 sm:max-w-lg sm:mx-auto sm:rounded-lg sm:px-10">
        <div className="max-w-md mx-auto">
          <div className="divide-y divide-gray-300/50">
            <div className="text-base leading-7 font-semibold text-center">
              
              <p className="text-gray-900">Autocomplete bellow for you convenience</p>
              <div className='pt-2 pb-2'>
                <Autocomplete suggestions={suggestions} handleInputSelected={handleInputSelected}></Autocomplete>
                <p className="text-right mt-2">Selected Value: {(inputSelected) ? inputSelected : "Empty"}</p>
              </div>
            </div>

            <div className="py-8 text-base leading-7 space-y-6 text-gray-600">
              <p>An Autocomplete component playground for you, including support for things like:</p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <svg className="w-6 h-6 flex-none fill-sky-100 stroke-sky-500 stroke-2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="11" />
                    <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none" />
                  </svg>
                  <p className="ml-4">
                    Easily integration with backend
                  </p>
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 flex-none fill-sky-100 stroke-sky-500 stroke-2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="11" />
                    <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none" />
                  </svg>
                  <p className="ml-4">
                    Only for fun
                  </p>
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 flex-none fill-sky-100 stroke-sky-500 stroke-2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="11" />
                    <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none" />
                  </svg>
                  <p className="ml-4">Perfect to ctrl + c, ctrl + v.</p>
                </li>
              </ul>
            </div>

            <div className="font-semibold border-t pt-4">                
                <div className='text-center'>
                    <Link className="" href="https://github.com/rafaellucena31">
                    <div className="inline-flex items-center text-sky-300 hover:text-sky-500 hover:underline m-2 cursor-pointer">
                        <a target="_blank">Github</a>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                      </div>
                    </Link>

                    <Link href="https://rafael-portfolio-2019.herokuapp.com/">
                      <div className="inline-flex items-center text-sky-300 hover:text-sky-500 hover:underline m-2 cursor-pointer">
                        <a target="_blank">Projects</a>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                      </div>
                    </Link>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}
