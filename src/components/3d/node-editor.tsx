'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
} from '@/components/unified';
import { KnowledgeNode } from '@/types/api';

interface NodeEditorProps {
  node?: KnowledgeNode | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (node: Partial<KnowledgeNode>) => void;
  onDelete?: (nodeId: string) => void;
  mode: 'create' | 'edit';
}

interface NodeFormData {
  title: string;
  description: string;
  type: 'concept' | 'skill' | 'topic' | 'course';
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  difficulty: number;
  importance: number;
  learningTime: number;
  position: { x: number; y: number; z: number };
  color: string;
}

const defaultFormData: NodeFormData = {
  title: '',
  description: '',
  type: 'concept',
  category: '',
  level: 'beginner',
  difficulty: 0.5,
  importance: 0.5,
  learningTime: 60,
  position: { x: 0, y: 0, z: 0 },
  color: '#4f46e5',
};

const nodeTypes = [
  { value: 'concept', label: '概念', icon: '💡' },
  { value: 'skill', label: '技能', icon: '🛠️' },
  { value: 'topic', label: '主题', icon: '📚' },
  { value: 'course', label: '课程', icon: '🎓' },
];

const levels = [
  { value: 'beginner', label: '初级', color: '#10b981' },
  { value: 'intermediate', label: '中级', color: '#f59e0b' },
  { value: 'advanced', label: '高级', color: '#ef4444' },
];

const predefinedColors = [
  '#4f46e5', '#7c3aed', '#db2777', '#dc2626',
  '#ea580c', '#d97706', '#65a30d', '#059669',
  '#0891b2', '#0284c7', '#2563eb', '#4338ca',
];

export function NodeEditor({
  node,
  isOpen,
  onClose,
  onSave,
  onDelete,
  mode,
}: NodeEditorProps) {
  const [formData, setFormData] = useState<NodeFormData>(() => {
    if (mode === 'edit' && node) {
      return {
        title: node.title,
        description: node.description,
        type: node.type,
        category: node.category,
        level: node.level,
        difficulty: node.metadata.difficulty,
        importance: node.metadata.importance,
        learningTime: node.metadata.learningTime,
        position: node.position,
        color: (node as any).color || '#4f46e5',
      };
    }
    return { ...defaultFormData };
  });

  const [errors, setErrors] = useState<Partial<Record<keyof NodeFormData, string>>>({});

  const validateForm = useCallback(() => {
    const newErrors: Partial<Record<keyof NodeFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = '标题不能为空';
    }

    if (!formData.description.trim()) {
      newErrors.description = '描述不能为空';
    }

    if (!formData.category.trim()) {
      newErrors.category = '分类不能为空';
    }

    if (formData.learningTime < 1) {
      newErrors.learningTime = '学习时长必须大于0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSave = useCallback(() => {
    if (!validateForm()) return;

    const nodeData: Partial<KnowledgeNode> = {
      ...(mode === 'edit' && node ? { id: node.id } : {}),
      title: formData.title,
      description: formData.description,
      type: formData.type,
      category: formData.category,
      level: formData.level,
      position: formData.position,
      metadata: {
        difficulty: formData.difficulty,
        importance: formData.importance,
        prerequisites: node?.metadata.prerequisites || [],
        learningTime: formData.learningTime,
      },
      connections: node?.connections || [],
      resources: node?.resources || { courses: [], articles: [], videos: [] },
      ...(mode === 'create' ? { 
        userProgress: { 
          isLearned: false, 
          masteryLevel: 0 
        } 
      } : {}),
    };

    onSave(nodeData);
    onClose();
  }, [formData, validateForm, onSave, onClose, mode, node]);

  const handleDelete = useCallback(() => {
    if (node && onDelete) {
      onDelete(node.id);
      onClose();
    }
  }, [node, onDelete, onClose]);

  const updateFormData = useCallback((field: keyof NodeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {mode === 'create' ? '创建新节点' : '编辑节点'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 基本信息 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">基本信息</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">标题 *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  placeholder="输入节点标题"
                  className={`bg-gray-800 border-gray-600 ${errors.title ? 'border-red-500' : ''}`}
                />
                {errors.title && (
                  <p className="text-sm text-red-400">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">分类 *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => updateFormData('category', e.target.value)}
                  placeholder="如：前端开发、AI、数据科学"
                  className={`bg-gray-800 border-gray-600 ${errors.category ? 'border-red-500' : ''}`}
                />
                {errors.category && (
                  <p className="text-sm text-red-400">{errors.category}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">描述 *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="详细描述这个知识节点的内容"
                rows={3}
                className={`bg-gray-800 border-gray-600 ${errors.description ? 'border-red-500' : ''}`}
              />
              {errors.description && (
                <p className="text-sm text-red-400">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>节点类型</Label>
                <Select value={formData.type} onValueChange={(value: any) => updateFormData('type', value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {nodeTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <span className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          <span>{type.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>难度级别</Label>
                <Select value={formData.level} onValueChange={(value: any) => updateFormData('level', value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {levels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <span className="flex items-center gap-2">
                          <span 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: level.color }}
                          />
                          <span>{level.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 属性设置 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">属性设置</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>难度系数: {Math.round(formData.difficulty * 100)}%</Label>
                <Slider
                  value={[formData.difficulty]}
                  onValueChange={([value]) => updateFormData('difficulty', value)}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>重要性: {Math.round(formData.importance * 100)}%</Label>
                <Slider
                  value={[formData.importance]}
                  onValueChange={([value]) => updateFormData('importance', value)}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="learningTime">学习时长 (分钟)</Label>
                <Input
                  id="learningTime"
                  type="number"
                  value={formData.learningTime}
                  onChange={(e) => updateFormData('learningTime', parseInt(e.target.value) || 0)}
                  min={1}
                  className={`bg-gray-800 border-gray-600 ${errors.learningTime ? 'border-red-500' : ''}`}
                />
                {errors.learningTime && (
                  <p className="text-sm text-red-400">{errors.learningTime}</p>
                )}
              </div>
            </div>
          </div>

          {/* 位置和外观 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">位置和外观</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="posX">X 坐标</Label>
                <Input
                  id="posX"
                  type="number"
                  value={formData.position.x}
                  onChange={(e) => updateFormData('position', {
                    ...formData.position,
                    x: parseFloat(e.target.value) || 0
                  })}
                  step={0.1}
                  className="bg-gray-800 border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="posY">Y 坐标</Label>
                <Input
                  id="posY"
                  type="number"
                  value={formData.position.y}
                  onChange={(e) => updateFormData('position', {
                    ...formData.position,
                    y: parseFloat(e.target.value) || 0
                  })}
                  step={0.1}
                  className="bg-gray-800 border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="posZ">Z 坐标</Label>
                <Input
                  id="posZ"
                  type="number"
                  value={formData.position.z}
                  onChange={(e) => updateFormData('position', {
                    ...formData.position,
                    z: parseFloat(e.target.value) || 0
                  })}
                  step={0.1}
                  className="bg-gray-800 border-gray-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>节点颜色</Label>
              <div className="flex flex-wrap gap-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formData.color === color ? 'border-white scale-110' : 'border-gray-600'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => updateFormData('color', color)}
                  />
                ))}
              </div>
              <Input
                type="color"
                value={formData.color}
                onChange={(e) => updateFormData('color', e.target.value)}
                className="w-20 h-10 bg-gray-800 border-gray-600"
              />
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-between pt-4 border-t border-gray-700">
          <div>
            {mode === 'edit' && onDelete && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                删除节点
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="border-gray-600 text-gray-300">
              取消
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              {mode === 'create' ? '创建' : '保存'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
