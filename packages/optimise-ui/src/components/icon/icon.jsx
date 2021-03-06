import React, { Component } from 'react';

/*
Font Awesome Free 5.1.0 by @fontawesome - https://fontawesome.com
License - https://fontawesome.com/license (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
*/

export default class Icon extends Component {
    render() {
        const { symbol } = this.props;
        switch (symbol) {
            case 'search':
                return (
                    <svg {...this.props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" preserveAspectRatio="xMaxYMax meet">
                        <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
                    </svg>
                );
            case 'filter':
                return (
                    <svg {...this.props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" preserveAspectRatio="xMaxYMax meet">
                        <path d="M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z" />
                    </svg>
                );
            case 'export':
                return (
                    <svg {...this.props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" preserveAspectRatio="xMaxYMax meet">
                        <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm76.45 211.36l-96.42 95.7c-6.65 6.61-17.39 6.61-24.04 0l-96.42-95.7C73.42 337.29 80.54 320 94.82 320H160v-80c0-8.84 7.16-16 16-16h32c8.84 0 16 7.16 16 16v80h65.18c14.28 0 21.4 17.29 11.27 27.36zM377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z" />
                    </svg>
                );
            case 'cloud':
                return (
                    <svg {...this.props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" preserveAspectRatio="xMaxYMax meet">
                        <path d="M32.553,17.466c3.034,0.457,5.381,3.092,5.381,6.247l0,0 c0,3.474-2.844,6.317-6.317,6.317H8.34c-3.473,0-6.317-2.842-6.317-6.317l0,0c0-2.872,1.943-5.313,4.579-6.072 c-0.073-0.333-0.112-0.677-0.112-1.031c0-2.641,2.141-4.782,4.781-4.782c1.569,0,2.963,0.758,3.835,1.926 c1.318-3.327,4.591-5.684,8.418-5.684c4.992,0,9.039,4.006,9.039,8.947C32.563,17.167,32.56,17.317,32.553,17.466z" />
                    </svg>
                );
            case 'setting':
                return (
                    <svg {...this.props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" preserveAspectRatio="xMaxYMax meet">
                        <path d="M444.788 291.1l42.616 24.599c4.867 2.809 7.126 8.618 5.459 13.985-11.07 35.642-29.97 67.842-54.689 94.586a12.016 12.016 0 0 1-14.832 2.254l-42.584-24.595a191.577 191.577 0 0 1-60.759 35.13v49.182a12.01 12.01 0 0 1-9.377 11.718c-34.956 7.85-72.499 8.256-109.219.007-5.49-1.233-9.403-6.096-9.403-11.723v-49.184a191.555 191.555 0 0 1-60.759-35.13l-42.584 24.595a12.016 12.016 0 0 1-14.832-2.254c-24.718-26.744-43.619-58.944-54.689-94.586-1.667-5.366.592-11.175 5.459-13.985L67.212 291.1a193.48 193.48 0 0 1 0-70.199l-42.616-24.599c-4.867-2.809-7.126-8.618-5.459-13.985 11.07-35.642 29.97-67.842 54.689-94.586a12.016 12.016 0 0 1 14.832-2.254l42.584 24.595a191.577 191.577 0 0 1 60.759-35.13V25.759a12.01 12.01 0 0 1 9.377-11.718c34.956-7.85 72.499-8.256 109.219-.007 5.49 1.233 9.403 6.096 9.403 11.723v49.184a191.555 191.555 0 0 1 60.759 35.13l42.584-24.595a12.016 12.016 0 0 1 14.832 2.254c24.718 26.744 43.619 58.944 54.689 94.586 1.667 5.366-.592 11.175-5.459 13.985L444.788 220.9a193.485 193.485 0 0 1 0 70.2zM336 256c0-44.112-35.888-80-80-80s-80 35.888-80 80 35.888 80 80 80 80-35.888 80-80z" />
                    </svg>
                );
            case 'check':
                return (
                    <svg {...this.props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" preserveAspectRatio="xMaxYMax meet">
                        <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                    </svg>
                );
            case 'logout':
                return (
                    <svg {...this.props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" preserveAspectRatio="xMaxYMax meet">
                        <path d="M448 384v64c0 17.673-14.327 32-32 32H32c-17.673 0-32-14.327-32-32v-64c0-17.673 14.327-32 32-32h384c17.673 0 32 14.327 32 32zM48.053 320h351.886c41.651 0 63.581-49.674 35.383-80.435L259.383 47.558c-19.014-20.743-51.751-20.744-70.767 0L12.67 239.565C-15.475 270.268 6.324 320 48.053 320z" />
                    </svg>
                );
            case 'delete':
                return (
                    <svg {...this.props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" preserveAspectRatio="xMaxYMax meet">
                        <path d="M192 188v216c0 6.627-5.373 12-12 12h-24c-6.627 0-12-5.373-12-12V188c0-6.627 5.373-12 12-12h24c6.627 0 12 5.373 12 12zm100-12h-24c-6.627 0-12 5.373-12 12v216c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12V188c0-6.627-5.373-12-12-12zm132-96c13.255 0 24 10.745 24 24v12c0 6.627-5.373 12-12 12h-20v336c0 26.51-21.49 48-48 48H80c-26.51 0-48-21.49-48-48V128H12c-6.627 0-12-5.373-12-12v-12c0-13.255 10.745-24 24-24h74.411l34.018-56.696A48 48 0 0 1 173.589 0h100.823a48 48 0 0 1 41.16 23.304L349.589 80H424zm-269.611 0h139.223L276.16 50.913A6 6 0 0 0 271.015 48h-94.028a6 6 0 0 0-5.145 2.913L154.389 80zM368 128H80v330a6 6 0 0 0 6 6h276a6 6 0 0 0 6-6V128z" />
                    </svg>
                );
            case 'addVisit':
                return (
                    <svg {...this.props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" preserveAspectRatio="xMaxYMax meet">
                        <path d="M447.1 112c-34.2.5-62.3 28.4-63 62.6-.5 24.3 12.5 45.6 32 56.8V344c0 57.3-50.2 104-112 104-60 0-109.2-44.1-111.9-99.2C265 333.8 320 269.2 320 192V36.6c0-11.4-8.1-21.3-19.3-23.5L237.8.5c-13-2.6-25.6 5.8-28.2 18.8L206.4 35c-2.6 13 5.8 25.6 18.8 28.2l30.7 6.1v121.4c0 52.9-42.2 96.7-95.1 97.2-53.4.5-96.9-42.7-96.9-96V69.4l30.7-6.1c13-2.6 21.4-15.2 18.8-28.2l-3.1-15.7C107.7 6.4 95.1-2 82.1.6L19.3 13C8.1 15.3 0 25.1 0 36.6V192c0 77.3 55.1 142 128.1 156.8C130.7 439.2 208.6 512 304 512c97 0 176-75.4 176-168V231.4c19.1-11.1 32-31.7 32-55.4 0-35.7-29.2-64.5-64.9-64zm.9 80c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16z" />
                    </svg>
                );
            case 'addTest':
                return (
                    <svg {...this.props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 512" preserveAspectRatio="xMaxYMax meet">
                        <path d="M477.7 186.1L309.5 18.3c-3.1-3.1-8.2-3.1-11.3 0l-34 33.9c-3.1 3.1-3.1 8.2 0 11.3l11.2 11.1L33 316.5c-38.8 38.7-45.1 102-9.4 143.5 20.6 24 49.5 36 78.4 35.9 26.4 0 52.8-10 72.9-30.1l246.3-245.7 11.2 11.1c3.1 3.1 8.2 3.1 11.3 0l34-33.9c3.1-3 3.1-8.1 0-11.2zM318 256H161l148-147.7 78.5 78.3L318 256z" />
                    </svg>
                );
            case 'addTreatment':
                return (
                    <svg {...this.props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" preserveAspectRatio="xMaxYMax meet">
                        <path d="M555.3 300.1L424.2 112.8C401.9 81 366.4 64 330.4 64c-22.6 0-45.5 6.7-65.5 20.7-19.7 13.8-33.7 32.8-41.5 53.8C220.5 79.2 172 32 112 32 50.1 32 0 82.1 0 144v224c0 61.9 50.1 112 112 112s112-50.1 112-112V218.9c3.3 8.6 7.3 17.1 12.8 25L368 431.2c22.2 31.8 57.7 48.8 93.8 48.8 22.7 0 45.5-6.7 65.5-20.7 51.7-36.2 64.2-107.5 28-159.2zM160 256H64V144c0-26.5 21.5-48 48-48s48 21.5 48 48v112zm194.8 44.9l-65.6-93.7c-7.7-11-10.7-24.4-8.3-37.6 2.3-13.2 9.7-24.8 20.7-32.5 8.5-6 18.5-9.1 28.8-9.1 16.5 0 31.9 8 41.3 21.5l65.6 93.7-82.5 57.7z" />
                    </svg>
                );
            case 'addEvent':
                return (
                    <svg {...this.props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" preserveAspectRatio="xMaxYMax meet">
                        <path d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z" />
                    </svg>
                );
            case 'loading':
                return (
                    <svg {...this.props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" preserveAspectRatio="xMaxYMax meet">
                    </svg>
                );
            case 'addVS':
                return (
                    <svg {...this.props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" preserveAspectRatio="xMaxYMax meet">
                        <path d="M320.2 243.8l-49.7 99.4c-6 12.1-23.4 11.7-28.9-.6l-56.9-126.3-30 71.7H60.6l182.5 186.5c7.1 7.3 18.6 7.3 25.7 0L451.4 288H342.3l-22.1-44.2zM473.7 73.9l-2.4-2.5c-51.5-52.6-135.8-52.6-187.4 0L256 100l-27.9-28.5c-51.5-52.7-135.9-52.7-187.4 0l-2.4 2.4C-10.4 123.7-12.5 203 31 256h102.4l35.9-86.2c5.4-12.9 23.6-13.2 29.4-.4l58.2 129.3 49-97.9c5.9-11.8 22.7-11.8 28.6 0l27.6 55.2H481c43.5-53 41.4-132.3-7.3-182.1z" />
                    </svg>
                );
            case 'sign':
            case 'symptom':
                return (
                    <svg {...this.props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" preserveAspectRatio="xMaxYMax meet">
                        <path d="M569.354 231.631C512.969 135.949 407.81 72 288 72 168.14 72 63.004 135.994 6.646 231.631a47.999 47.999 0 0 0 0 48.739C63.031 376.051 168.19 440 288 440c119.86 0 224.996-63.994 281.354-159.631a47.997 47.997 0 0 0 0-48.738zM288 392c-75.162 0-136-60.827-136-136 0-75.162 60.826-136 136-136 75.162 0 136 60.826 136 136 0 75.162-60.826 136-136 136zm104-136c0 57.438-46.562 104-104 104s-104-46.562-104-104c0-17.708 4.431-34.379 12.236-48.973l-.001.032c0 23.651 19.173 42.823 42.824 42.823s42.824-19.173 42.824-42.823c0-23.651-19.173-42.824-42.824-42.824l-.032.001C253.621 156.431 270.292 152 288 152c57.438 0 104 46.562 104 104z" />
                    </svg>
                );
            case 'user':
                return (
                    <svg {...this.props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" preserveAspectRatio="xMaxYMax meet">
                        <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z" />
                    </svg>
                );
            case 'key':
                return (
                    <svg {...this.props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" preserveAspectRatio="xMaxYMax meet">
                        <path d="M512 176.001C512 273.203 433.202 352 336 352c-11.22 0-22.19-1.062-32.827-3.069l-24.012 27.014A23.999 23.999 0 0 1 261.223 384H224v40c0 13.255-10.745 24-24 24h-40v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24v-78.059c0-6.365 2.529-12.47 7.029-16.971l161.802-161.802C163.108 213.814 160 195.271 160 176 160 78.798 238.797.001 335.999 0 433.488-.001 512 78.511 512 176.001zM336 128c0 26.51 21.49 48 48 48s48-21.49 48-48-21.49-48-48-48-48 21.49-48 48z" />
                    </svg>
                );
            case 'trash':
                return (
                    <svg {...this.props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" preserveAspectRatio="xMaxYMax meet">
                        <path d="M192 188v216c0 6.627-5.373 12-12 12h-24c-6.627 0-12-5.373-12-12V188c0-6.627 5.373-12 12-12h24c6.627 0 12 5.373 12 12zm100-12h-24c-6.627 0-12 5.373-12 12v216c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12V188c0-6.627-5.373-12-12-12zm132-96c13.255 0 24 10.745 24 24v12c0 6.627-5.373 12-12 12h-20v336c0 26.51-21.49 48-48 48H80c-26.51 0-48-21.49-48-48V128H12c-6.627 0-12-5.373-12-12v-12c0-13.255 10.745-24 24-24h74.411l34.018-56.696A48 48 0 0 1 173.589 0h100.823a48 48 0 0 1 41.16 23.304L349.589 80H424zm-269.611 0h139.223L276.16 50.913A6 6 0 0 0 271.015 48h-94.028a6 6 0 0 0-5.145 2.913L154.389 80zM368 128H80v330a6 6 0 0 0 6 6h276a6 6 0 0 0 6-6V128z" />
                    </svg>

                );
            case 'edit':
                return (
                    <svg {...this.props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" preserveAspectRatio="xMaxYMax meet">
                        <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" />
                    </svg>

                );
            case 'communication':
                return (
                    <svg {...this.props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" preserveAspectRatio="xMaxYMax meet">
                        <path d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32zM128 272c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z" />
                    </svg>
                );
            case 'measure':
                return (
                    <svg {...this.props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" preserveAspectRatio="xMaxYMax meet">
                        <path d="M75.694 480a48.02 48.02 0 0 1-42.448-25.571C12.023 414.3 0 368.556 0 320 0 160.942 128.942 32 288 32s288 128.942 288 288c0 48.556-12.023 94.3-33.246 134.429A48.018 48.018 0 0 1 500.306 480H75.694zM512 288c-17.673 0-32 14.327-32 32 0 17.673 14.327 32 32 32s32-14.327 32-32c0-17.673-14.327-32-32-32zM288 128c17.673 0 32-14.327 32-32 0-17.673-14.327-32-32-32s-32 14.327-32 32c0 17.673 14.327 32 32 32zM64 288c-17.673 0-32 14.327-32 32 0 17.673 14.327 32 32 32s32-14.327 32-32c0-17.673-14.327-32-32-32zm65.608-158.392c-17.673 0-32 14.327-32 32 0 17.673 14.327 32 32 32s32-14.327 32-32c0-17.673-14.327-32-32-32zm316.784 0c-17.673 0-32 14.327-32 32 0 17.673 14.327 32 32 32s32-14.327 32-32c0-17.673-14.327-32-32-32zm-87.078 31.534c-12.627-4.04-26.133 2.92-30.173 15.544l-45.923 143.511C250.108 322.645 224 350.264 224 384c0 35.346 28.654 64 64 64 35.346 0 64-28.654 64-64 0-19.773-8.971-37.447-23.061-49.187l45.919-143.498c4.039-12.625-2.92-26.133-15.544-30.173z" />
                    </svg>
                );
            case 'expand':
                return (
                    <svg {...this.props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" preserveAspectRatio="xMaxYMax meet">
                        <path d="M0 180V56c0-13.3 10.7-24 24-24h124c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H64v84c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12zM288 44v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12V56c0-13.3-10.7-24-24-24H300c-6.6 0-12 5.4-12 12zm148 276h-40c-6.6 0-12 5.4-12 12v84h-84c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24V332c0-6.6-5.4-12-12-12zM160 468v-40c0-6.6-5.4-12-12-12H64v-84c0-6.6-5.4-12-12-12H12c-6.6 0-12 5.4-12 12v124c0 13.3 10.7 24 24 24h124c6.6 0 12-5.4 12-12z" />
                    </svg>
                );
            case 'close':
                return (
                    <svg {...this.props} xmlns="http://www.w3.org/2000/svg" viewBox="0 50 400 370" preserveAspectRatio="xMaxYMax meet">
                        <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" />
                    </svg>
                );
            case 'help':
                return (
                    <svg {...this.props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" preserveAspectRatio="xMaxYMax meet">
                        <path d="M19.975,37.993c-9.937,0-17.996-8.059-17.996-17.997 C1.979,10.06,10.038,2,19.975,2s17.996,8.06,17.996,17.997C37.971,29.934,29.912,37.993,19.975,37.993z M18.04,31.264 c0.455,0.444,0.988,0.666,1.601,0.666c0.634,0,1.163-0.216,1.585-0.649s0.634-0.967,0.634-1.601c0-0.634-0.211-1.168-0.634-1.6 c-0.422-0.434-0.951-0.65-1.585-0.65c-0.633,0-1.173,0.216-1.616,0.65c-0.444,0.432-0.666,0.966-0.666,1.6 C17.359,30.292,17.586,30.819,18.04,31.264z M25.029,9.742c-1.374-1.162-3.085-1.743-5.135-1.743c-1.311,0-2.557,0.301-3.74,0.904 c-1.184,0.602-2.103,1.453-2.757,2.552c-0.402,0.676-0.603,1.352-0.603,2.028c0,0.529,0.164,0.967,0.492,1.315 c0.327,0.349,0.745,0.522,1.251,0.522c0.592,0,1.109-0.306,1.553-0.919c0.845-1.141,1.268-1.711,1.268-1.711 c0.613-0.613,1.426-0.919,2.44-0.919c0.866,0,1.59,0.238,2.171,0.712c0.581,0.476,0.872,1.147,0.872,2.014 c0,0.993-0.306,1.764-0.919,2.313c-0.444,0.402-1.205,0.771-2.282,1.109c-0.803,0.254-1.336,0.512-1.601,0.776 s-0.396,0.661-0.396,1.188v3.169c0,0.635,0.169,1.163,0.507,1.585c0.338,0.422,0.814,0.634,1.426,0.634 c0.993,0,1.617-0.486,1.87-1.458c0.085-0.339,0.127-1.204,0.127-2.599c1.733-0.339,3.101-1.083,4.104-2.235 c1.004-1.15,1.506-2.604,1.506-4.358C27.185,12.616,26.466,10.989,25.029,9.742z" />
                    </svg>
                );
            case 'sync':
                return (
                    <svg {...this.props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" preserveAspectRatio="xMaxYMax meet">
                        <path d="M34.037,8.13V7.862c0-1.033-0.844-1.876-1.877-1.876H21.982v10.18 c0,1.033,0.842,1.875,1.875,1.875h0.268c1.033,0,1.875-0.842,1.875-1.875v-3.475c0.145,0.128,0.289,0.258,0.428,0.395 c1.879,1.838,3.045,4.405,3.045,7.245v0.012h0.008c0,0.708-0.078,1.414-0.227,2.108c-0.143,0.675-0.355,1.328-0.631,1.951 c-1.404,3.196-4.412,5.527-8.002,5.975c-1.105,0.134-1.893,1.141-1.758,2.246s1.141,1.892,2.246,1.758 c5.025-0.628,9.236-3.887,11.201-8.355c0.381-0.868,0.68-1.783,0.883-2.739c0.199-0.934,0.305-1.92,0.305-2.943h0.008v-0.012 c0-3.959-1.631-7.542-4.258-10.112c-0.074-0.073-0.148-0.143-0.225-0.214h3.137C33.193,10.005,34.037,9.163,34.037,8.13z" />
                        <path d="M10.377,15.598c1.405-3.196,4.413-5.527,8.003-5.975 c1.106-0.135,1.892-1.141,1.757-2.246c-0.135-1.105-1.141-1.892-2.245-1.758c-5.027,0.628-9.237,3.888-11.202,8.355 c-0.381,0.868-0.68,1.783-0.882,2.739c-0.199,0.934-0.306,1.919-0.306,2.943H5.494v0.011c0,3.958,1.631,7.542,4.258,10.113 c0.074,0.073,0.148,0.143,0.225,0.214H6.84c-1.033,0-1.876,0.843-1.876,1.875v0.268c0,1.033,0.843,1.875,1.876,1.875h10.179V23.834 c0-1.033-0.843-1.875-1.876-1.875h-0.268c-1.032,0-1.875,0.842-1.875,1.875v3.475c-0.145-0.128-0.288-0.259-0.427-0.395 c-1.879-1.838-3.046-4.405-3.046-7.245v-0.011H9.52c0.001-0.709,0.079-1.414,0.227-2.108C9.89,16.874,10.103,16.221,10.377,15.598z" />
                    </svg>
                );
            case 'attention':
                return (
                    <svg {...this.props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" preserveAspectRatio="xMaxYMax meet">
                        <path d="M19.975,37.993c-9.938,0-17.996-8.059-17.996-17.997 C1.979,10.06,10.038,2,19.975,2c9.937,0,17.996,8.06,17.996,17.997C37.971,29.934,29.912,37.993,19.975,37.993z M23.011,9.643 c0-1.457-1.188-2.644-2.645-2.644h-0.721c-1.457,0-2.645,1.188-2.645,2.644v11.709c0,1.457,1.188,2.645,2.645,2.645h0.721 c1.457,0,2.645-1.188,2.645-2.645V9.643z M23.011,29.646c0-1.457-1.188-2.645-2.645-2.645h-0.721c-1.457,0-2.645,1.188-2.645,2.645 v0.721c0,1.456,1.188,2.645,2.645,2.645h0.721c1.457,0,2.645-1.188,2.645-2.645V29.646z" />
                    </svg>
                );
            default:
                return null;
        }
    }
}