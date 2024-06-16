import * as React from "react";
import Svg, { G, Path } from "react-native-svg";

export const JetzSvg = ({ color = "#000000", width = 250, height = 200 }) => (
  <Svg width={width} height={height} viewBox="030 100 400 400" color={"#aadf"}>
    <G>
      <Path
        fill={color}
        d="M321.852 181.607c-.225.03-1.08.137-1.897.23-2.027.23-5.067.872-8.289 1.738-26.7 7.253-132.492 36.696-158.45 44.092-5.814 1.655-11.866 3.382-13.436 3.828-1.57.446-2.878.834-2.902.862-.096.084.427 2.673.784 3.884.458 1.568.98 2.211 2.108 2.598 1.13.388 12.353 2.025 16.227 2.366 4.324.392 12.233.729 18.385.782 9.487.083 18.625-.81 25.719-2.535 2.816-.681 35.229-9.174 53.368-13.98 37.977-10.063 69.207-18.556 72.196-19.626 3.821-1.37 6.47-2.615 14.46-6.862 4.442-2.357 4.789-2.568 5.49-3.46.835-1.045 1.157-1.85 1.225-3.08.081-1.242-.119-1.986-.734-2.669-.522-.587-5.026-3.531-7.662-4.991-4.617-2.57-7.232-3.23-12.982-3.232-1.751-.008-3.385.025-3.61.055zM130.81 196.368c-.998.232-2.035.658-3.837 1.563-1.23.621-1.326.692-1.236.967.045.151 2.298 7.317 4.988 15.9 2.69 8.584 4.92 15.654 4.967 15.709.058.068 23.673-6.666 24.423-6.965.132-.056-1.344-1.6-7.808-8.165-6.196-6.306-9.205-9.46-13.362-14.01-3.517-3.852-4.625-4.778-6.11-5.078-.85-.17-.956-.168-2.025.079zM123.655 294.468c-.06.028-.7.104-1.423.168-1.042.081-1.256.139-1.081.261 3.659 2.553 5.603 5.057 6.387 8.223.166.66.203 1.254.16 3.035l-.038 2.21-1.58 7.818c-4.078 20.092-13.961 69.822-15.708 79.078-.795 4.179-1.473 7.748-1.511 7.914l-.065.319 44.402-.514 44.413-.514 1.506-7.652 1.505-7.638-26.85.27c-23.869.248-26.839.255-26.836.075.007-.386 4.443-22.72 6.032-30.358l.71-3.404.603-.656c.338-.363.901-.798 1.283-.981l.692-.326 16.77-.236 16.78-.235.065-.305c.039-.166.69-3.57 1.446-7.568.756-3.998 1.394-7.374 1.432-7.513.063-.221-.836-.225-17.818-.028-16.981.196-17.88.193-17.817-.042.304-1.136 3.577-17.837 4.093-20.99.554-3.278 1.07-4.389 2.372-5.08l.633-.34 22.841-.333 22.84-.333.717-.34c.99-.467 1.578-.929 1.787-1.387.098-.208.263-.859.38-1.44.806-4.165-.857-8.522-3.995-10.404-1.815-1.098-3.666-1.463-7.793-1.58-2.874-.078-77.06.712-77.334.826zM223.19 293.398c-.38.074-.725.16-.762.202-.036.042.844 1.164 1.968 2.504 2.283 2.734 2.79 3.488 3.643 5.466 1.036 2.362 2.16 3.73 3.951 4.814 1.651.974 3.594 1.504 6.489 1.733.815.06 5.489.075 10.388.018 8.438-.098 8.91-.09 8.848.132-.14.512-18.497 93.786-18.463 93.827.082.082 4.668-.316 6.115-.526 7.734-1.167 14.153-4.21 20.162-9.552 7.956-7.106 13.425-17.412 16.737-31.601 1.892-8.084 3.808-17.55 7.666-37.929 1.147-6.018 2.173-11.249 2.286-11.623.59-1.94 1.446-2.888 2.884-3.222.356-.073 6.687-.174 16.036-.24 8.496-.058 15.785-.142 16.189-.202 1.98-.285 2.632-1.673 2.36-5.08-.337-4.386-1.652-7.008-4.23-8.441-1.16-.65-1.972-.93-3.646-1.27-.896-.183-6.031-.15-49.462.324-26.97.299-48.768.593-49.16.666zM345.257 291.985c-.403.06-.807.147-.867.162-.071.028.97 1.37 2.291 2.983 2.468 2.98 3.068 3.83 3.985 5.545 1.627 3.018 3.974 4.827 7.379 5.657 2.886.713 1.916.696 29.653.485 14.153-.108 26.009-.149 26.351-.111l.614.09-1.407 1.3c-1.178 1.076-29.28 25.547-73.67 64.135-5.251 4.575-9.805 8.59-10.12 8.939-.313.349-.616.794-.69.988-.175.5-1.038 4.513-1.738 8.041-1.287 6.586-2.07 10.792-2.024 10.86.116.124 105.475-1.138 105.856-1.28.964-.329 1.555-.957 1.796-1.898.368-1.413 2.651-12.925 2.66-13.436.003-.166-4.86-.137-35.462.19l-35.478.369 1.564-1.481c2.045-1.915 49.745-42.972 74.835-64.398 5.945-5.08 11.086-9.475 11.434-9.783 2.548-2.252 3.67-5.564 3.294-9.729-.228-2.524-.839-4.16-2.114-5.677-1.634-1.928-4.009-2.825-8.37-3.12-2.127-.14-98.645.99-99.772 1.169zM62.046 295.899l-4.556.094.97.638c2.176 1.424 3.869 3.42 4.719 5.577.725 1.814.885 2.806.846 5.03l-.044 1.864-3.058 15.22c-4.457 22.182-7.08 35.52-9.507 48.498-1.044 5.576-1.236 6.434-1.77 7.862-1.079 2.829-2.95 5.004-5.591 6.47-1.29.706-4.161 1.843-5.778 2.276-1.165.317-1.473.335-5.141.363-2.142.011-7.134-.055-11.084-.147-3.95-.093-7.215-.124-7.251-.082-.12.125-3.413 15.239-3.357 15.404.168.55 5.6 1.122 12.364 1.32 8.077.238 17.545-.59 27.006-2.342 11.644-2.15 19.797-5.627 26.844-11.41 1.416-1.162 3.516-3.506 4.512-5.022.985-1.516 2.006-3.723 2.558-5.566.276-.886 1.206-5.384 2.466-11.818 1.118-5.714 3.857-19.62 6.101-30.925 7.033-35.547 6.548-32.822 6.364-35.194-.367-4.69-2.813-7.602-6.85-8.135-2.585-.357-12.098-.343-30.763.025zM55.444 445.734c.045.11.177.674.297 1.267l.242 1.074-1.201 7.123c-.66 3.915-1.227 7.262-1.266 7.428l-.064.319 6.473-.075 6.485-.075.646-1.112c.342-.612.636-1.167.637-1.25.002-.097-1.43-.122-4.115-.09-4 .046-4.13.033-4.339-.226-.208-.274-.207-.343.15-2.528.2-1.231.397-2.352.423-2.49.063-.222.3-.238 2.892-.268l2.84-.033.053-.318c.207-1.01.339-1.8.342-1.965.003-.18-.435-.202-2.837-.174l-2.84.033.065-.318c.026-.166.183-.997.327-1.827.395-2.296.061-2.14 4.534-2.192l3.645-.042.13-.664c.078-.36.17-.94.224-1.314l.094-.65-6.946.08c-6.047.07-6.935.108-6.891.287zM101.087 445.924c.121.523.24 1.115.272 1.35.042.303-2.042 13.304-2.39 14.895-.05.235.316.245 6.422.174l6.485-.075.683-1.181c.39-.653.696-1.21.696-1.25.001-.042-1.892-.048-4.2-.021l-4.2.049-.172-.33c-.172-.301-.157-.495.148-2.39.197-1.12.382-2.213.421-2.434l.078-.374 2.816-.033c2.592-.03 2.829-.046 2.892-.282.089-.332.34-1.84.344-2.06.002-.139-.565-.173-2.826-.147l-2.816.032.25-1.494c.133-.816.302-1.687.377-1.923.252-.872.276-.873 4.288-.92l3.645-.041.052-.318c.22-1.094.34-1.813.344-2.034.004-.276-.138-.274-6.907-.196l-6.923.08.221.923zM221.59 443.976c.044.22.164.785.274 1.281l.197.895-1.214 7.193a912.322 912.322 0 0 0-1.242 7.428c-.004.234.375.244 6.422.174l6.438-.075.683-1.181c.39-.653.695-1.21.696-1.25 0-.042-1.857-.048-4.14-.022-4.024.047-4.154.035-4.386-.239a.702.702 0 0 1-.166-.647c.039-.207.223-1.272.408-2.365.185-1.107.367-2.048.404-2.117.036-.056 1.327-.126 2.877-.144l2.805-.032.199-1.245.211-1.245-2.84.033-2.84.033.093-.595c.282-1.922.526-3.043.72-3.322.219-.306.266-.306 3.983-.418l3.776-.113.16-.968c.092-.54.196-1.107.235-1.287l.064-.304-6.935.08-6.934.08.052.372zM76.25 446.694c3.78 6.486 4.55 7.844 4.5 7.928-.036.069-1.902 1.885-4.152 4.051-2.25 2.166-4.092 3.968-4.093 3.996 0 .027.816.046 1.81.034l1.799-.02 3.02-2.921 3.021-2.92 1.654 2.866 1.654 2.852 3.23-.023 3.23-.038-1.01-1.755a495.75 495.75 0 0 0-2.814-4.813l-1.804-3.072 3.923-3.786 3.935-3.787-1.798-.02-1.81-.021-2.756 2.669c-1.516 1.453-2.78 2.655-2.803 2.655-.024 0-.737-1.179-1.576-2.605l-1.54-2.605-3.171.037-3.183.037.735 1.261zM122.99 445.118c-.539.324-1.179 1.09-1.33 1.63-.076.236-.574 3.058-1.128 6.281l-1.001 5.865.715 1.04c.404.576.912 1.316 1.131 1.63l.404.59 5.337-.062 5.326-.062.646-1.112c.342-.611.636-1.167.637-1.25.002-.096-1.5-.12-4.352-.087-4.083.047-4.379.037-4.552-.196-.116-.137-.194-.398-.191-.591.006-.332 1.67-10.222 1.795-10.665.038-.139.208-.375.376-.529.3-.266.467-.282 4.194-.325 2.142-.024 3.894-.072 3.895-.1 0-.028.092-.553.197-1.148.105-.595.197-1.12.198-1.19.001-.055-2.672-.065-5.939-.028-5.313.062-6 .098-6.358.309zM141.558 444.834c-.001.096.097.579.218 1.074.122.496.218 1.06.215 1.268-.004.207-.416 2.807-.93 5.781-.501 2.974-.923 5.478-.925 5.574-.002.097.493.906 1.105 1.782l1.108 1.603 5.479-.064c3.585-.041 5.598-.12 5.825-.22.405-.183.96-.77 1.181-1.255.098-.195.74-3.709 1.426-7.817.699-4.094 1.292-7.594 1.33-7.774l.065-.304-2.544.03c-1.396.015-2.545.07-2.546.125-.005.277-2.28 13.321-2.38 13.695-.265.9-.527 1.014-2.574 1.038-1.006.011-1.928-.033-2.045-.115-.492-.312-.463-.602.735-7.532.643-3.652 1.159-6.75 1.161-6.889.016-.22-.197-.232-2.942-.2-2.284.026-2.96.076-2.962.2zM163.33 445.41c-.092.553-.197 1.12-.223 1.245-.063.236.114.247 2.6.219 1.467-.017 2.685.01 2.708.065.022.069-.508 3.319-1.18 7.234-.671 3.914-1.226 7.206-1.24 7.303-.002.138.542.16 2.507.11l2.522-.071 1.2-7.055c.659-3.887 1.225-7.18 1.251-7.331.052-.263.17-.278 2.776-.378l2.71-.1.158-.9c.092-.497.172-1.037.175-1.216l.018-.304-7.906.092-7.916.091-.16.996zM186.053 445.078c.12.523.241 1.088.273 1.28.043.263-2.05 13.112-2.399 14.759l-.065.318 2.533-.03 2.532-.029.133-.802c.078-.429.71-4.15 1.398-8.258a3401.38 3401.38 0 0 1 1.344-7.857l.077-.373-3.017.035-3.03.035.22.922zM197.921 444.32c.044.178.982 4.074 2.085 8.672l2.02 8.37 2.827-.032c2.51-.03 2.806-.06 2.75-.253-.034-.11-.178-.674-.298-1.225l-.243-1.019 3.528-6.225c1.93-3.419 3.834-6.795 4.224-7.476l.708-1.251-2.14-.017c-1.184 0-2.166.012-2.19.04-.024.027.084.564.239 1.212l.287 1.17-2.698 4.766c-1.502 2.668-2.72 4.698-2.754 4.588-.022-.11-.552-2.272-1.158-4.805-.619-2.533-1.236-5.121-1.39-5.754l-.277-1.13-2.793.033-2.78.032.053.303zM252.874 444.608l.274 1.24-1.24 7.372-1.253 7.373 2.472.012c1.373-.002 2.509-.015 2.533-.043.012-.027.3-1.632.63-3.569.33-1.936.632-3.68.672-3.9l.077-.374 2.355-.027c1.29-.015 2.355 0 2.354.041-.002.097-1.178 7.137-1.255 7.497l-.065.319 2.545-.03c1.396-.016 2.545-.07 2.545-.112.002-.097 2.733-16.267 2.85-16.834l.077-.374-2.532.03-2.544.029-.58 3.417-.581 3.43-2.25.067c-1.23.028-2.295.04-2.378 0-.082-.04.042-1.05.437-3.29.314-1.771.566-3.306.58-3.403.002-.124-.672-.158-3.003-.131l-2.994.035.274 1.225zM279.899 443.163c-.001.07.132.592.275 1.184.155.592.24 1.157.191 1.24-.037.098-1.941 3.46-4.212 7.49s-4.128 7.365-4.129 7.42c-.002.11 4.119-.061 4.215-.173.036-.042-.06-.58-.204-1.199l-.276-1.128.5-.89.513-.89 3.1-.035c2.841-.033 3.113-.022 3.204.197.057.138.289 1.074.52 2.065l.417 1.831 2.817-.032 2.805-.033-.276-1.142c-.155-.62-1.093-4.474-2.075-8.563l-1.799-7.434-2.792-.01c-1.538.005-2.793.047-2.794.102zm1.92 7.971c.33 1.363.571 2.506.535 2.562-.074.153-4.062.185-4.06.033.004-.18 2.836-5.168 2.894-5.1.023.027.31 1.156.63 2.505zM295.116 443.056c.046.096.493.906.987 1.783.493.892.892 1.743.89 1.909-.003.152-.507 3.25-1.126 6.86-.62 3.61-1.121 6.598-1.122 6.626 0 .028.473.05 1.04.043l1.042-.012.91-5.394c.502-2.974.946-5.354.992-5.3.035.07 1.378 2.442 2.96 5.281l2.88 5.186 2.367-.028c1.302-.015 2.368-.083 2.369-.138 0-.069.12-.83.278-1.701.145-.871.765-4.537 1.384-8.147.608-3.61 1.147-6.737 1.187-6.958l.077-.374-1.053.012-1.053.013-.965 5.768c-.54 3.181-.988 5.795-1 5.823-.013.014-1.459-2.55-3.213-5.733l-3.189-5.761-3.36.038c-2.663.031-3.35.08-3.282.204zM318.951 442.711c-.001.07.096.634.226 1.281l.24 1.171-1.213 7.124c-.66 3.914-1.238 7.234-1.276 7.359-.063.235.268.245 5.89.18l5.963-.069 1.686-1.662 1.673-1.649 1.028-6.003c.555-3.306 1.018-6.155 1.022-6.348.009-.525-.416-1.238-.862-1.454-.34-.161-1.583-.175-7.393-.107-3.834.044-6.983.122-6.984.177zm9.56 2.678.372.396-.884 5.229c-.606 3.555-.956 5.312-1.09 5.48-.096.125-.408.377-.683.532-.43.24-.738.284-2.182.301-.923.01-1.68-.008-1.68-.05.003-.138 1.993-11.77 2.056-12.006.063-.208.253-.238 1.898-.257l1.822-.02.372.395zM341.018 442.649c.045.165.165.702.287 1.198l.209.908-1.199 7c-.659 3.845-1.226 7.193-1.266 7.442l-.078.442 6.485-.102 6.498-.117.648-1.222.648-1.209-4.13.048c-3.834.044-4.13.034-4.303-.199a.904.904 0 0 1-.192-.508c.004-.277 2.21-13.39 2.323-13.805.063-.222-.138-.233-2.966-.2-3.03.035-3.03.035-2.964.324zM360.167 442.317c.034.096.155.647.287 1.225l.242 1.06-1.201 7.096c-.66 3.901-1.238 7.235-1.277 7.4l-.065.32 2.557-.03c1.408-.017 2.557-.085 2.558-.154.002-.125 2.719-16.142 2.849-16.793l.077-.373-3.041.035c-2.45.028-3.03.076-2.986.214zM371.327 442.174c.046.096.493.905.987 1.783.493.892.892 1.73.89 1.867-.003.138-.506 3.223-1.125 6.833a826.249 826.249 0 0 0-1.122 6.667c0 .042.46.078 1.04.071l1.03-.012.831-4.952c.462-2.711.883-5.146.923-5.408.09-.443.183-.306 3.05 4.838l2.95 5.294 2.366-.027c1.503-.018 2.368-.083 2.37-.166.002-.152 2.733-16.308 2.837-16.847.064-.305.04-.304-.977-.293l-1.041.012-.844 4.939c-.45 2.724-.898 5.353-.977 5.837l-.158.885-2.73-4.91a560.937 560.937 0 0 1-3.188-5.79l-.458-.864-3.361.039c-2.675.031-3.362.08-3.293.204zM396.258 442.065c-.886.631-.924.742-2.058 7.423-.58 3.361-1.007 6.183-.961 6.279.045.096.553.85 1.118 1.685l1.038 1.52 5.93-.068 5.94-.055.224-1.356c.131-.733.54-3.099.92-5.257l.684-3.9-3.03.035-3.03.035-.695 1.223-.707 1.209.946.03c.543.022.945.086.943.169-.003.193-.794 4.84-.87 5.145-.064.222-.241.238-2.028.231l-1.964-.019-.23-.37-.23-.37.819-4.883c.46-2.683.882-5.118.946-5.395.064-.276.284-.666.488-.861l.373-.363 4.355-.05 4.367-.051.131-.734c.078-.387.17-.954.223-1.245l.08-.511-6.603.076-6.616.077-.503.35z"
      />
    </G>
  </Svg>
);