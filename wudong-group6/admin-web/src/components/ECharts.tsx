import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface EChartsProps {
  option: echarts.EChartsOption;
  style?: React.CSSProperties;
}

const ECharts: React.FC<EChartsProps> = ({ option, style }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // 初始化：仅一次
  useEffect(() => {
    if (!chartRef.current) return;
    chartInstance.current = echarts.init(chartRef.current);
    chartInstance.current.setOption(option, true);

    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      // 用静态方法彻底清理DOM残留
      if (chartRef.current) {
        echarts.dispose(chartRef.current);
      }
      chartInstance.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 数据更新：复用实例
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.setOption(option, true);
    }
  }, [option]);

  return <div ref={chartRef} style={{ width: '100%', height: '300px', ...style }} />;
};

export default ECharts;
