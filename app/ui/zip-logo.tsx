import { GlobeAltIcon } from '@heroicons/react/24/outline';
// import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function ZipLogo() {
  return (
    <div
      className={`flex flex-row items-center leading-none text-white`}
    >
      <Image
                      src="https://static.zip.co/logo/zip-logo.svg"
                      alt=""
                      className="mr-4"
                      width={88}
                      height={44}
                    />
      {/* <GlobeAltIcon className="h-12 w-12 rotate-[15deg]" /> */}
      {/* <p className="text-[38px]">Testing Tools</p> */}
    </div>
  );
}
