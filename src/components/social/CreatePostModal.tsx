"use client";

import React, { useState } from 'react';
import { X, Image as ImageIcon, Link as LinkIcon, Lock, Globe, EyeOff } from 'lucide-react';
import { useSocial } from '@/context/SocialContext';
import { SocialButton } from './SocialButton';
import { PostVisibility } from '@/types/social';
import { cn } from '@/lib/utils';
import { Badge } from './Badge';

interface CreatePostModalProps {
  onClose: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose }) => {
  const { createPost, currentUser } = useSocial();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [summary, setSummary] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<PostVisibility>('PUBLIC');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTag = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && tagsInput.trim()) {
          e.preventDefault();
          if (!tags.includes(tagsInput.trim())) {
              setTags([...tags, tagsInput.trim()]);
          }
          setTagsInput('');
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!title || !description || !currentUser) return;
      
      setIsLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      createPost({
          authorId: currentUser.id,
          title,
          description,
          summary: summary || description.slice(0, 100) + '...',
          tags,
          visibility,
          galleryImageUrls: [], // Mocking empty for now or could add random seed
          coverImageUrl: `https://picsum.photos/seed/${Date.now()}/800/400`
      });
      
      setIsLoading(false);
      onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
       <div className="bg-white dark:bg-[#15171e] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">انتشار پروژه جدید</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
              </button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <div className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">عنوان پروژه</label>
                      <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="مثلاً: سیستم مدیریت تسک با Next.js"
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all font-bold"
                      />
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">توضیحات کوتاه</label>
                      <input 
                        type="text" 
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="یک خط توضیح جذاب درباره پروژه..."
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                      />
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">توضیحات کامل</label>
                      <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="درباره ویژگی‌ها، چالش‌ها و تکنولوژی‌های استفاده شده بنویسید..."
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all resize-y"
                      />
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">تگ‌ها (Enter بزنید)</label>
                      <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus-within:ring-2 focus-within:ring-green-500/50 transition-all">
                          {tags.map(tag => (
                              <Badge key={tag} variant="primary" className="flex items-center gap-1">
                                  {tag}
                                  <button onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-red-500 ml-1"><X className="w-3 h-3" /></button>
                              </Badge>
                          ))}
                          <input 
                            type="text" 
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            onKeyDown={handleAddTag}
                            placeholder={tags.length === 0 ? "React, TypeScript..." : ""}
                            className="bg-transparent focus:outline-none min-w-[100px] text-sm"
                          />
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-gray-500 hover:border-green-500 hover:text-green-500 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-900/50">
                           <ImageIcon className="w-8 h-8 mb-2" />
                           <span className="text-sm font-medium">تصویر کاور</span>
                       </div>
                       <div className="p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-gray-500 hover:border-green-500 hover:text-green-500 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-900/50">
                           <ImageIcon className="w-8 h-8 mb-2" />
                           <span className="text-sm font-medium">گالری تصاویر</span>
                       </div>
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">سطح دسترسی</label>
                      <div className="flex gap-2">
                          <button 
                            type="button"
                            onClick={() => setVisibility('PUBLIC')}
                            className={cn("flex-1 p-3 rounded-xl border transition-all flex flex-col items-center gap-2", visibility === 'PUBLIC' ? "border-green-500 bg-green-50 dark:bg-green-900/10 text-green-600" : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800")}
                          >
                             <Globe className="w-5 h-5" />
                             <span className="text-sm font-bold">عمومی</span>
                          </button>
                          <button 
                            type="button"
                            onClick={() => setVisibility('UNLISTED')}
                            className={cn("flex-1 p-3 rounded-xl border transition-all flex flex-col items-center gap-2", visibility === 'UNLISTED' ? "border-orange-500 bg-orange-50 dark:bg-orange-900/10 text-orange-600" : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800")}
                          >
                             <LinkIcon className="w-5 h-5" />
                             <span className="text-sm font-bold">فقط با لینک</span>
                          </button>
                          <button 
                            type="button"
                            onClick={() => setVisibility('PRIVATE')}
                            className={cn("flex-1 p-3 rounded-xl border transition-all flex flex-col items-center gap-2", visibility === 'PRIVATE' ? "border-red-500 bg-red-50 dark:bg-red-900/10 text-red-600" : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800")}
                          >
                             <Lock className="w-5 h-5" />
                             <span className="text-sm font-bold">خصوصی</span>
                          </button>
                      </div>
                  </div>
              </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#12141a] flex justify-end gap-3">
              <SocialButton variant="ghost" onClick={onClose} disabled={isLoading}>
                  انصراف
              </SocialButton>
              <SocialButton variant="primary" onClick={handleSubmit} isLoading={isLoading}>
                  انتشار پروژه
              </SocialButton>
          </div>
       </div>
    </div>
  );
};
