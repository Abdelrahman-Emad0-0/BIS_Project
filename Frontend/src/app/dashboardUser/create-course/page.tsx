'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

const STEPS = ['Basic Information', 'Curriculum', 'Pricing', 'Preview & Publish'];
const CATEGORIES = ['Programming','Design','Marketing','Languages','Data Science','Photography','Business','Health','Music'];

interface Section { id?: number; title: string; lessons: Lesson[]; }
interface Lesson  { id?: number; title: string; duration: string; }

function CreateCourseContent() {
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get('edit');

  const [step, setStep] = useState(0);
  const [courseId, setCourseId] = useState<number | null>(editId ? Number(editId) : null);
  const [saving, setSaving] = useState(false);

  // Step 1
  const [form, setForm] = useState({ title:'', description:'', category:'', duration:'', capacity:'' });
  // Step 2
  const [sections, setSections] = useState<Section[]>([{ title:'Introduction', lessons:[{ title:'Welcome', duration:'5 min' }] }]);
  // Step 3
  const [price, setPrice] = useState('0');
  // Step 4
  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    if (editId) {
      api.get(`/courses/${editId}/details`).then(res => {
        const c = res.data.course;
        setForm({ title:c.title||'', description:c.description||'', category:c.category||'', duration:c.duration||'', capacity:c.capacity||'' });
        setPrice(String(c.price||'0'));
        if (c.sections?.length) setSections(c.sections.map((s:any) => ({ id:s.id, title:s.title, lessons: s.lessons||[] })));
        setCourse(c);
      }).catch(() => {});
    }
  }, [editId]);

  // Step 1 — save basic info
  const saveBasicInfo = async () => {
    if (!form.title || !form.description || !form.category) { alert('Fill all required fields'); return; }
    setSaving(true);
    try {
      if (courseId) {
        await api.put(`/courses/${courseId}`, form);
      } else {
        const res = await api.post('/courses', form);
        setCourseId(res.data.data?.id || res.data.course?.id || res.data.id);
      }
      setStep(1);
    } catch(e:any) { alert(e.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  // Step 2 — save curriculum
  const saveCurriculum = async () => {
    if (!courseId) { setStep(2); return; }
    setSaving(true);
    try {
      for (const sec of sections) {
        if (!sec.title) continue;
        let secId = sec.id;
        if (!secId) {
          const r = await api.post(`/courses/${courseId}/sections`, { title: sec.title, order: sections.indexOf(sec) });
          secId = r.data.data?.id;
        }
        if (secId) {
          for (const les of sec.lessons) {
            if (!les.title) continue;
            if (!les.id) {
              await api.post(`/sections/${secId}/lessons`, { title: les.title, duration: les.duration, order: sec.lessons.indexOf(les) });
            }
          }
        }
      }
      setStep(2);
    } catch(e:any) { alert(e.response?.data?.message || 'Failed to save curriculum'); }
    finally { setSaving(false); }
  };

  // Step 3 — save pricing
  const savePricing = async () => {
    if (!courseId) { setStep(3); return; }
    setSaving(true);
    try {
      await api.put(`/courses/${courseId}`, { price: Number(price) });
      // Load course details for preview
      const res = await api.get(`/courses/${courseId}/details`);
      setCourse(res.data.course);
      setStep(3);
    } catch(e:any) { alert(e.response?.data?.message || 'Failed to save pricing'); }
    finally { setSaving(false); }
  };

  // Step 4 — publish
  const publish = async () => {
    if (!courseId) { router.push('/dashboardUser/teach'); return; }
    setSaving(true);
    try {
      await api.put(`/courses/${courseId}`, { status: 'published' });
      alert('Course published successfully! 🎉');
      router.push('/dashboardUser/teach');
    } catch(e:any) { alert(e.response?.data?.message || 'Failed to publish'); }
    finally { setSaving(false); }
  };

  // Section helpers
  const addSection = () => setSections(s => [...s, { title:'', lessons:[{ title:'', duration:'' }] }]);
  const updateSection = (i:number, title:string) => setSections(s => s.map((sec,idx) => idx===i ? {...sec,title} : sec));
  const addLesson = (si:number) => setSections(s => s.map((sec,idx) => idx===si ? {...sec,lessons:[...sec.lessons,{title:'',duration:''}]} : sec));
  const updateLesson = (si:number, li:number, key:string, val:string) =>
    setSections(s => s.map((sec,si2) => si2===si ? {...sec,lessons:sec.lessons.map((l,li2)=>li2===li?{...l,[key]:val}:l)} : sec));
  const removeSection = (i:number) => setSections(s => s.filter((_,idx)=>idx!==i));
  const removeLesson  = (si:number, li:number) => setSections(s => s.map((sec,si2) => si2===si ? {...sec,lessons:sec.lessons.filter((_,li2)=>li2!==li)} : sec));

  return (
    <div className="min-h-screen bg-[#F8F9FE] p-6 lg:p-8 text-[#141033]">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{editId ? 'Edit Course' : 'Create a New Course'}</h1>
            <p className="text-gray-500 text-sm">Build a high-quality course and share your knowledge.</p>
          </div>
          <Link href="/dashboardUser/teach">
            <button className="border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50">← Back</button>
          </Link>
        </div>

        {/* Stepper */}
        <div className="flex items-center mb-8 overflow-x-auto gap-2">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center shrink-0">
              <button onClick={() => { if (courseId || i === 0) setStep(i); }}
                className={`flex items-center gap-2 transition ${i <= step ? 'text-[#602AEA]' : 'text-gray-400'}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition ${i < step ? 'bg-[#602AEA] border-[#602AEA] text-white' : i === step ? 'border-[#602AEA] text-[#602AEA]' : 'border-gray-300 text-gray-400'}`}>
                  {i < step ? '✓' : i + 1}
                </span>
                <span className="text-sm font-bold hidden sm:block">{s}</span>
              </button>
              {i < 3 && <div className={`w-8 lg:w-16 h-0.5 mx-2 ${i < step ? 'bg-[#602AEA]' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">

          {/* STEP 1 — Basic Info */}
          {step === 0 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-lg font-bold border-b pb-3">Basic Information</h2>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Course Title *</label>
                <input value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))}
                  placeholder="Enter an engaging title for your course"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#602AEA]" />
                <p className="text-[10px] text-right text-gray-400 mt-1">{form.title.length}/100</p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Description *</label>
                <textarea value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))}
                  placeholder="What will students learn? What's covered in the course?"
                  rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#602AEA] resize-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">Category *</label>
                  <select value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#602AEA]">
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">Duration</label>
                  <input value={form.duration} onChange={e => setForm(f=>({...f,duration:e.target.value}))}
                    placeholder="e.g. 8 weeks"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#602AEA]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">Capacity (students)</label>
                  <input value={form.capacity} onChange={e => setForm(f=>({...f,capacity:e.target.value}))}
                    placeholder="e.g. 30" type="number"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#602AEA]" />
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={saveBasicInfo} disabled={saving}
                  className="bg-[#602AEA] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#5022C0] disabled:opacity-60">
                  {saving ? 'Saving...' : 'Save & Continue →'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Curriculum */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-lg font-bold">Course Curriculum</h2>
                <button onClick={addSection} className="text-xs text-[#602AEA] font-bold flex items-center gap-1">
                  <i className="fa-solid fa-plus"></i> Add Section
                </button>
              </div>

              {sections.map((sec, si) => (
                <div key={si} className="border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 flex items-center gap-3">
                    <i className="fa-solid fa-grip-lines text-gray-400"></i>
                    <input value={sec.title} onChange={e => updateSection(si, e.target.value)}
                      placeholder={`Section ${si+1} title`}
                      className="flex-1 bg-transparent font-bold text-sm outline-none" />
                    <button onClick={() => addLesson(si)} className="text-[10px] text-[#602AEA] font-bold">+ Lesson</button>
                    <button onClick={() => removeSection(si)} className="text-gray-400 hover:text-red-500 ml-2">
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                  {sec.lessons.map((les, li) => (
                    <div key={li} className="px-4 py-3 border-t border-gray-100 flex items-center gap-3">
                      <i className="fa-solid fa-play text-[#602AEA] text-xs w-4"></i>
                      <input value={les.title} onChange={e => updateLesson(si,li,'title',e.target.value)}
                        placeholder={`Lesson ${li+1} title`}
                        className="flex-1 text-sm outline-none border border-gray-200 rounded-lg px-3 py-1.5 focus:border-[#602AEA]" />
                      <input value={les.duration} onChange={e => updateLesson(si,li,'duration',e.target.value)}
                        placeholder="Duration"
                        className="w-24 text-xs outline-none border border-gray-200 rounded-lg px-3 py-1.5 focus:border-[#602AEA]" />
                      <button onClick={() => removeLesson(si,li)} className="text-gray-400 hover:text-red-500">
                        <i className="fa-solid fa-xmark text-xs"></i>
                      </button>
                    </div>
                  ))}
                </div>
              ))}

              <div className="flex justify-between">
                <button onClick={() => setStep(0)} className="border border-gray-200 px-6 py-3 rounded-xl font-bold text-sm">← Back</button>
                <button onClick={saveCurriculum} disabled={saving}
                  className="bg-[#602AEA] text-white px-8 py-3 rounded-xl font-bold disabled:opacity-60">
                  {saving ? 'Saving...' : 'Save & Continue →'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Pricing */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-lg font-bold border-b pb-3">Course Pricing</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label:'Free', desc:'Great for building audience', value:'0', icon:'🎁' },
                  { label:'Paid', desc:'Set your own price', value:'custom', icon:'💰' },
                ].map(opt => (
                  <button key={opt.label} onClick={() => { if(opt.value==='0') setPrice('0'); else if(price==='0') setPrice(''); }}
                    className={`p-5 rounded-2xl border-2 text-left transition ${(opt.value==='0' && price==='0') || (opt.value==='custom' && price!=='0') ? 'border-[#602AEA] bg-purple-50' : 'border-gray-200'}`}>
                    <div className="text-2xl mb-2">{opt.icon}</div>
                    <p className="font-bold text-[#141033]">{opt.label}</p>
                    <p className="text-xs text-gray-500">{opt.desc}</p>
                  </button>
                ))}
              </div>

              {price !== '0' && (
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-2 block">Price (EGP)</label>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-bold">EGP</span>
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)}
                      placeholder="0.00" min="0"
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-xl font-bold outline-none focus:border-[#602AEA]" />
                  </div>
                </div>
              )}

              <div className="bg-purple-50 rounded-2xl p-5">
                <h3 className="font-bold text-[#141033] mb-2">💡 Pricing Tips</h3>
                <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                  <li>Free courses get 3x more enrollments</li>
                  <li>Paid courses between EGP 99-299 have the highest completion rates</li>
                  <li>You keep 80% of revenue from each enrollment</li>
                </ul>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="border border-gray-200 px-6 py-3 rounded-xl font-bold text-sm">← Back</button>
                <button onClick={savePricing} disabled={saving}
                  className="bg-[#602AEA] text-white px-8 py-3 rounded-xl font-bold disabled:opacity-60">
                  {saving ? 'Saving...' : 'Save & Continue →'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 — Preview & Publish */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-lg font-bold border-b pb-3">Preview & Publish</h2>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-[#141033] mb-1">{form.title || 'Your Course Title'}</h3>
                <p className="text-sm text-gray-500 mb-4">{form.description}</p>
                <div className="flex flex-wrap gap-3 text-xs">
                  <span className="bg-white border px-3 py-1.5 rounded-full font-bold text-[#602AEA]">{form.category}</span>
                  {form.duration && <span className="bg-white border px-3 py-1.5 rounded-full text-gray-600">🕒 {form.duration}</span>}
                  {form.capacity && <span className="bg-white border px-3 py-1.5 rounded-full text-gray-600">👥 {form.capacity} students max</span>}
                  <span className="bg-white border px-3 py-1.5 rounded-full font-bold text-green-600">
                    {Number(price) === 0 ? 'Free' : `EGP ${Number(price).toLocaleString()}`}
                  </span>
                </div>
              </div>

              {sections.length > 0 && (
                <div>
                  <h3 className="font-bold text-sm mb-3">Curriculum ({sections.length} sections, {sections.reduce((t,s)=>t+s.lessons.length,0)} lessons)</h3>
                  <div className="space-y-2">
                    {sections.map((s, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl px-4 py-3">
                        <p className="font-bold text-sm">{s.title}</p>
                        <p className="text-xs text-gray-400">{s.lessons.length} lessons</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <h3 className="font-bold text-green-700 mb-1">✅ Ready to Publish!</h3>
                <p className="text-xs text-green-600">Your course will be visible to all learners once published.</p>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="border border-gray-200 px-6 py-3 rounded-xl font-bold text-sm">← Back</button>
                <button onClick={publish} disabled={saving}
                  className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-60">
                  {saving ? 'Publishing...' : '🚀 Publish Course'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CreateCoursePage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-[#602AEA] font-bold">Loading...</div>}>
      <CreateCourseContent />
    </Suspense>
  );
}
