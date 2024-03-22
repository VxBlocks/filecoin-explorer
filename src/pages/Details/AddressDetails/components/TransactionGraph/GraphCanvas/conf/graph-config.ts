export const MAXNODE = 2000;

export const graphConf = {
  height: '1050px',
  width:'100%',
  // 节点配置项
  nodes: {
    color: {
      border: "#a7aeaf",
      background: "#b6cfec",
      highlight: {
        border: "#acd1af",
        background: "#9ad9ca"
      },
      hover: {
        border: "#a7aeaf",
        background: "#c0d8f2"
      },
    },
    fixed: {                   // 是否固定节点的x左边或者y左边
      y: false,
      x: true,                 
    },
    physics: false,
    chosen: true,
    shape: "dot",
    size: 20,
  },
  // 默认边配置项
  edges: {
    arrows: {
      to: {
        enabled: true,          // 启用指向to的箭头
        type: "arrow",
      }
    },
    color: {
      color: '#a3d4bc',       // 边的颜色
      highlight: '#8a9d6d',   // 选中边时的颜色，点击边或聚焦的边
      hover: '#bcc7ad'
    },
    font: {                     // 边的label字体设置
      size: 14,
      color: '#474444',
    },
    physics: false              // 关闭弹簧效果，启用层次布局时也会同样关闭弹簧
  },
  // 图谱交互配置项
  interaction: {
    hover: true,                // 启用悬停，当鼠标移到节点上时，节点使用其悬停颜色。
    keyboard: {                 // 键盘快捷键，可以使用小键盘旁边的上下左右键移动图谱。
      enabled: true,
      speed: {                  // 设置移动速度
        x: 3,
        y: 3,
        zoom: 0.02              // 缩放速度
      },
      bindToWindow: false,
    },
    tooltipDelay: 300,          // 提示框显示的延迟时间（毫秒）。当节点或边具有“title”属性时，可以将其用提示框显示。提示框本身是一个HTML元素，可以使用CSS自定义样式。
  },
  // 布局配置项
  layout: {
    improvedLayout: true,
    clusterThreshold:4,
    hierarchical: {             // 层次布局配置
      enabled: true,
      direction: 'LR',          // 布局方向
      sortMethod: "directed",    // hubsize 将边最多的节点放在顶部。 由此计算层次布局的其余部分。directed根据边的“to”和“from”数据计算层级。A->B，因此B低于A的层级。
      levelSeparation: 220,     // 不同层之间的距离，也就是左右节点的距离
      shakeTowards: "leaves"
    }
  },
  // 图谱物理引擎配置项，打开后可配置节点的重力模拟以及弹簧等性质。
  physics: {
    enabled: false,
  }

}