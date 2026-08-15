import React, { useState } from 'react';
import { ArrowRight, CalendarDays, Clock3, LockKeyhole, Sparkles, UserRound } from 'lucide-react';
import type { BirthProfile, LifeDestinyResult } from '../types';
import { generateLocalDestiny } from '../lib/localDestiny';

interface ImportDataModeProps {
  onDataImport: (data: LifeDestinyResult, name: string) => void;
}

const ImportDataMode: React.FC<ImportDataModeProps> = ({ onDataImport }) => {
  const [profile, setProfile] = useState<BirthProfile>({
    name: '',
    gender: 'Male',
    birthDate: '',
    birthTime: '12:00',
  });
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  const updateProfile = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!profile.birthDate || !profile.birthTime) {
      setError('请填写出生日期和出生时间');
      return;
    }

    const birthDate = new Date(`${profile.birthDate}T${profile.birthTime}:00`);
    if (Number.isNaN(birthDate.getTime())) {
      setError('出生日期或时间格式不正确');
      return;
    }
    if (birthDate.getTime() > Date.now()) {
      setError('出生时间不能晚于现在');
      return;
    }

    try {
      onDataImport(generateLocalDestiny(profile), profile.name.trim());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (generateError) {
      setError(generateError instanceof Error ? generateError.message : '生成失败，请检查输入信息');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100"
    >
      <div className="text-center mb-7">
        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold font-serif-sc text-gray-900">输入出生信息，立即生成</h2>
        <p className="text-sm text-gray-500 mt-2">无需懂八字，无需复制提示词，也无需等待 AI</p>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-2">
              <UserRound className="w-4 h-4 text-indigo-500" />
              姓名 <span className="font-normal text-gray-400">（选填）</span>
            </span>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={updateProfile}
              maxLength={20}
              autoComplete="name"
              placeholder="怎么称呼你"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-bold text-gray-700 mb-2">性别</span>
            <select
              name="gender"
              value={profile.gender}
              onChange={updateProfile}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all bg-white"
            >
              <option value="Male">男</option>
              <option value="Female">女</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-2">
              <CalendarDays className="w-4 h-4 text-indigo-500" />
              公历出生日期
            </span>
            <input
              required
              type="date"
              name="birthDate"
              value={profile.birthDate}
              onChange={updateProfile}
              min="1900-01-01"
              max={today}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all"
            />
          </label>

          <label className="block">
            <span className="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-2">
              <Clock3 className="w-4 h-4 text-indigo-500" />
              出生时间
            </span>
            <input
              required
              type="time"
              name="birthTime"
              value={profile.birthTime}
              onChange={updateProfile}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all"
            />
            <span className="block text-xs text-gray-400 mt-1.5">请按出生地当时的当地时间填写</span>
          </label>
        </div>

        {error && (
          <div role="alert" className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-[0.99] text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
        >
          生成我的人生 K 线
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800">
          <LockKeyhole className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="text-xs leading-relaxed">
            全程在当前浏览器本地计算，不调用 AI、不消耗 Token，也不会上传或保存你的出生信息。
          </p>
        </div>
      </div>
    </form>
  );
};

export default ImportDataMode;
