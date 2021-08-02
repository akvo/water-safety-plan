import flatten from "lodash/flatten";
import uniq from "lodash/uniq";
import sumBy from "lodash/sumBy";
import difference from "lodash/difference";
import { parentDeep, formatNumber } from "../util.js";
import {
  Color,
  Easing,
  TextStyle,
  backgroundColor,
  Icons,
} from "./chart-style.js";

const flatall = (arr) => {
  return arr
    ? arr.reduce(
        (result, item) => [
          ...result,
          {
            id: item.id,
            name: item.name,
            parent_id: item.parent_id,
            childrens: item.childrens,
          },
          ...flatall(item.childrens),
        ],
        []
      )
    : [];
};

const remapParent = (parent, results) => {
  return parent.map((x) => {
    let children = x.childrens;
    if (children.length > 0) {
      children = remapParent(children, results);
    } else {
      return results.find((r) => r.id === x.id);
    }
    return {
      id: x.id,
      name: x.name,
      children: children.filter((x) => x),
      value: sumBy(children, "value"),
    };
  });
};

const colorMappingChange = (value) => {
  var levelOption = getLevelOption(value);
  chart.setOption({
    series: [
      {
        levels: levelOption,
      },
    ],
  });
};

const getLevelOption = () => {
  return [
    {
      itemStyle: {
        borderColor: "#355c7d",
        borderWidth: 0,
        gapWidth: 1,
      },
      upperLabel: {
        fontFamily: "Roboto",
        show: false,
      },
    },
    {
      itemStyle: {
        borderColor: "#355c7d",
        borderWidth: 5,
        gapWidth: 1,
      },
      emphasis: {
        upperLabel: {
          fontFamily: "Roboto",
          color: "#355c7d",
        },
        itemStyle: {
          borderColor: "#ddd",
        },
      },
    },
    {
      itemStyle: {
        borderWidth: 5,
        gapWidth: 1,
        borderColorSaturation: 0.4,
      },
    },
    {
      itemStyle: {
        borderWidth: 3,
        gapWidth: 1,
        borderColorSaturation: 0.7,
      },
    },
    {
      itemStyle: {
        borderWidth: 2,
        gapWidth: 1,
        borderColorSaturation: 0.4,
      },
    },
  ];
};

const TreeMap = (title, subtitle, data, extra) => {
  let val;
  if (sumBy(data, "value") === 0) {
    return {
      title: {
        text: title,
        subtext: "No Data",
        left: "center",
        top: "20px",
        ...TextStyle,
      },
    };
  }
  const text_style = TextStyle;
  let option = {
    ...Color,
    title: {
      text: title,
      subtext: subtitle,
      left: "center",
      top: "20px",
      ...text_style,
    },
    tooltip: {
      show: true,
      trigger: "item",
      showDelay: 0,
      padding: 5,
      backgroundColor: "#f2f2f2",
      transitionDuration: 0.2,
      formatter: function (params) {
        val = params.value;
        let name = params.name;
        name = params.name.split(":")[0];
        name = name.split("(")[0];
        return name + ":" + val;
      },
      top: "bottom",
      left: "center",
      textStyle: {
        ...text_style.textStyle,
        fontSize: 12,
      },
    },
    toolbox: {
      show: true,
      orient: "horizontal",
      left: "right",
      top: "top",
      feature: {
        saveAsImage: {
          type: "jpg",
          title: "save image",
          icon: Icons.saveAsImage,
          backgroundColor: "#ffffff",
        },
        restore: {
          title: "reset",
          icon: Icons.reset,
        },
      },
      backgroundColor: "#FFF",
    },
    series: [
      {
        name: "Actions",
        type: "treemap",
        visibleMin: 600,
        width: "100%",
        top: "15%",
        roam: "move",
        label: {
          show: true,
          fontFamily: "Roboto",
          fontSize: 8,
          formatter: function (x) {
            val = x.value;
            let name = x.name.split(":")[0];
            return "{title|" + name + "}" + "\n\n" + "{label|" + val + "}";
          },
          rich: {
            title: {
              align: "center",
              color: "#ffffff",
              fontSize: 10,
              lineHeight: 20,
            },
            hr: {
              width: "100%",
              borderColor: "rgba(255,255,255,0.2)",
              borderWidth: 0.5,
              height: 0,
              lineHeight: 10,
            },
            label: {
              fontSize: 12,
              fontWeight: 400,
              backgroundColor: "rgba(0,0,0,.3)",
              color: "#ffffff",
              borderRadius: 100,
              padding: 10,
              width: 12.5,
              lineHeight: 20,
              align: "center",
            },
          },
        },
        upperLabel: {
          fontFamily: "Roboto",
          show: true,
          height: 30,
        },
        itemStyle: {
          borderColor: "#355c7d",
          borderWidth: 0,
          gapWidth: 1,
        },
        levels: getLevelOption(),
        breadcrumb: {
          show: true,
          itemStyle: {
            textStyle: {
              borderWidth: 0,
              fontFamily: "Roboto",
            },
            shadowColor: "transparent",
          },
          height: 15,
          bottom: 0,
        },
        data: data,
      },
    ],
    ...backgroundColor,
    ...Color,
    //color: ['#6c5b7b','#c06c84','#f67280','#f8b195','#F59C2F','#845435','#226E7B','#2C201F'],
    ...Easing,
    ...extra,
  };
  return option;
};

export default TreeMap;
