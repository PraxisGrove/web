'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/unified';

interface DiagnosticInfo {
  webglSupported: boolean;
  webgl2Supported: boolean;
  userAgent: string;
  vendor: string;
  renderer: string;
  version: string;
  extensions: string[];
  maxTextureSize: number;
  maxVertexAttribs: number;
  reactThreeFiberLoaded: boolean;
  error?: string;
}

export function ThreeJSDebugPanel() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    async function runDiagnostics() {
      const info: Partial<DiagnosticInfo> = {
        userAgent: navigator.userAgent,
        webglSupported: false,
        webgl2Supported: false,
        vendor: 'Unknown',
        renderer: 'Unknown',
        version: 'Unknown',
        extensions: [],
        maxTextureSize: 0,
        maxVertexAttribs: 0,
        reactThreeFiberLoaded: false,
      };

      try {
        // 检查 WebGL 1.0 支持
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;

        if (gl) {
          info.webglSupported = true;

          // 获取 WebGL 信息
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            info.vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'Unknown';
            info.renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Unknown';
          }

          info.version = gl.getParameter(gl.VERSION) || 'Unknown';
          info.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0;
          info.maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS) || 0;

          // 获取扩展列表
          const extensions = gl.getSupportedExtensions();
          info.extensions = extensions || [];
        }

        // 检查 WebGL 2.0 支持
        const gl2 = canvas.getContext('webgl2');
        if (gl2) {
          info.webgl2Supported = true;
        }

        // 尝试加载 React Three Fiber
        try {
          await import('@react-three/fiber');
          await import('@react-three/drei');
          info.reactThreeFiberLoaded = true;
        } catch (err) {
          info.error = `React Three Fiber 加载失败: ${err}`;
        }

      } catch (err) {
        info.error = `诊断过程出错: ${err}`;
      }

      setDiagnostics(info as DiagnosticInfo);
    }

    runDiagnostics();
  }, []);

  if (!diagnostics) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(!isVisible)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          🔧 3D 诊断
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={() => setIsVisible(!isVisible)}
        className={`mb-2 ${diagnostics.webglSupported ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
      >
        🔧 3D 诊断 {diagnostics.webglSupported ? '✅' : '❌'}
      </Button>

      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-96 max-h-96 overflow-y-auto"
        >
          <Card className="border-white/10 bg-black/90 text-white backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-lg">3D 渲染诊断报告</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* WebGL 支持状态 */}
              <div className="space-y-2">
                <h4 className="font-semibold">WebGL 支持</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className={`p-2 rounded ${diagnostics.webglSupported ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    WebGL 1.0: {diagnostics.webglSupported ? '✅ 支持' : '❌ 不支持'}
                  </div>
                  <div className={`p-2 rounded ${diagnostics.webgl2Supported ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    WebGL 2.0: {diagnostics.webgl2Supported ? '✅ 支持' : '⚠️ 不支持'}
                  </div>
                </div>
              </div>

              {/* React Three Fiber 状态 */}
              <div className="space-y-2">
                <h4 className="font-semibold">React Three Fiber</h4>
                <div className={`p-2 rounded text-sm ${diagnostics.reactThreeFiberLoaded ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {diagnostics.reactThreeFiberLoaded ? '✅ 加载成功' : '❌ 加载失败'}
                </div>
              </div>

              {/* 硬件信息 */}
              {diagnostics.webglSupported && (
                <div className="space-y-2">
                  <h4 className="font-semibold">硬件信息</h4>
                  <div className="space-y-1 text-xs">
                    <div><strong>显卡厂商:</strong> {diagnostics.vendor}</div>
                    <div><strong>渲染器:</strong> {diagnostics.renderer}</div>
                    <div><strong>WebGL 版本:</strong> {diagnostics.version}</div>
                    <div><strong>最大纹理尺寸:</strong> {diagnostics.maxTextureSize}px</div>
                    <div><strong>最大顶点属性:</strong> {diagnostics.maxVertexAttribs}</div>
                  </div>
                </div>
              )}

              {/* 浏览器信息 */}
              <div className="space-y-2">
                <h4 className="font-semibold">浏览器信息</h4>
                <div className="text-xs break-all">
                  {diagnostics.userAgent}
                </div>
              </div>

              {/* 错误信息 */}
              {diagnostics.error && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-400">错误信息</h4>
                  <div className="text-xs text-red-300 bg-red-500/10 p-2 rounded">
                    {diagnostics.error}
                  </div>
                </div>
              )}

              {/* 建议 */}
              <div className="space-y-2">
                <h4 className="font-semibold">建议</h4>
                <div className="text-xs space-y-1">
                  {!diagnostics.webglSupported && (
                    <div className="text-red-300">
                      • 您的浏览器不支持 WebGL，请更新浏览器或启用硬件加速
                    </div>
                  )}
                  {!diagnostics.reactThreeFiberLoaded && (
                    <div className="text-yellow-300">
                      • React Three Fiber 加载失败，可能是网络问题或版本兼容性问题
                    </div>
                  )}
                  {diagnostics.webglSupported && diagnostics.reactThreeFiberLoaded && (
                    <div className="text-green-300">
                      • 您的环境支持 3D 渲染，如果仍有问题请检查控制台错误
                    </div>
                  )}
                </div>
              </div>

              {/* 扩展信息 */}
              {diagnostics.extensions.length > 0 && (
                <details className="space-y-2">
                  <summary className="font-semibold cursor-pointer">WebGL 扩展 ({diagnostics.extensions.length})</summary>
                  <div className="text-xs max-h-32 overflow-y-auto">
                    {diagnostics.extensions.map((ext, index) => (
                      <div key={index} className="py-1">{ext}</div>
                    ))}
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
