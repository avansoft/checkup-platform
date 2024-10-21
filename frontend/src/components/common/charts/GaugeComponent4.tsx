import { IDynamicGaugeSVGProps } from "@/types";
import "./style.css";

const GaugeComponent4 = (props: IDynamicGaugeSVGProps) => {
  const { colorCode, value, height, className } = props;
  return (
    <svg
      width="100%"
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12.0273 128.584C8.08787 129.864 3.82743 127.713 2.84621 123.688C-0.286943 110.839 -0.84566 97.4691 1.23117 84.3566C3.30799 71.244 7.97075 58.7015 14.9214 47.4487C17.0982 43.9247 21.8149 43.1952 25.1659 45.6299C28.517 48.0645 29.2283 52.7399 27.0984 56.2924C21.5131 65.6082 17.7529 75.9293 16.0465 86.7031C14.3401 97.4769 14.7269 108.455 17.16 119.041C18.0879 123.077 15.9667 127.304 12.0273 128.584Z"
        fill={`${value >= 1 ? colorCode : "black"}`}
        fillOpacity={`${value >= 1 ? "0.9" : "0.1"}`}
      />
      <path
        d="M25.2108 45.5681C21.8618 43.1307 21.1019 38.4187 23.7835 35.2617C32.346 25.181 42.8405 16.8793 54.6745 10.8619C66.5085 4.84448 79.3993 1.2551 92.5893 0.274953C96.72 -0.0320015 100.08 3.3579 100.076 7.50003C100.073 11.6422 96.7059 14.9629 92.5796 15.3245C81.7592 16.2727 71.1966 19.2885 61.4734 24.2326C51.7501 29.1768 43.0906 35.9352 35.9499 44.1199C33.2268 47.2411 28.5599 48.0056 25.2108 45.5681Z"
        fill={`${value >= 2 ? colorCode : "black"}`}
        fillOpacity={`${value >= 2 ? "0.9" : "0.1"}`}
      />
      <path
        d="M100 7.5C100 3.35786 103.363 -0.0292584 107.493 0.281108C120.682 1.27215 133.57 4.87217 145.399 10.8994C157.228 16.9265 167.716 25.2369 176.27 35.3247C178.949 38.4839 178.185 43.1952 174.834 45.6299C171.483 48.0646 166.817 47.2963 164.096 44.1728C156.962 35.9822 148.308 29.2166 138.589 24.2645C128.87 19.3123 118.31 16.2878 107.49 15.3307C103.364 14.9656 100 11.6421 100 7.5Z"
        fill={`${value >= 3 ? colorCode : "black"}`}
        fillOpacity={`${value >= 3 ? "0.9" : "0.1"}`}
      />
      <path
        d="M174.858 45.6629C178.21 43.2297 182.927 43.9613 185.102 47.4863C192.047 58.7422 196.705 71.2867 198.776 84.4002C200.847 97.5137 200.282 110.883 197.143 123.731C196.16 127.755 191.899 129.905 187.96 128.623C184.021 127.341 181.902 123.114 182.832 119.077C185.269 108.492 185.661 97.5147 183.959 86.7402C182.258 75.9656 178.502 65.6429 172.921 56.3246C170.793 52.7711 171.506 48.0961 174.858 45.6629Z"
        fill={`${value === 4 ? colorCode : "black"}`}
        fillOpacity={`${value === 4 ? "0.9" : "0.1"}`}
      />
    </svg>
  );
};

export default GaugeComponent4;
