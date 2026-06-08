'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Heart, Check, Play, MessageSquare } from 'lucide-react';
import { api } from '@/lib/api';

export default function CourseDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [showPayment, setShowPayment] = useState(false);
  const [payMethod, setPayMethod] = useState<'card' | 'cash'>('card');
  const [payError, setPayError] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [voucher, setVoucher] = useState<any>(null);
  const [applyVoucher, setApplyVoucher] = useState(false);

  useEffect(() => {
    api.get(`/courses/${id}/details`)
      .then((res) => { setCourse(res.data.course); setLoading(false); })
      .catch(() => setLoading(false));
    // Fetch active voucher
    api.get('/rewards/active-voucher')
      .then((res) => setVoucher(res.data.voucher || null))
      .catch(() => {});
  }, [id]);

  const getDiscountedPrice = (price: number) => {
    if (!applyVoucher || !voucher) return price;
    if (voucher.discount_type === 'percent') return price * (1 - voucher.discount_value / 100);
    if (voucher.discount_type === 'free') return Math.max(0, price - voucher.discount_value);
    return price;
  };

  const handleEnrollClick = () => {
    if (Number(course.price) === 0) {
      doEnroll();
    } else {
      setPayError('');
      setApplyVoucher(false);
      setShowPayment(true);
    }
  };

  const doEnroll = async () => {
    setEnrolling(true);
    try {
      await api.post('/enrollments/enroll', { course_id: id });
      setEnrolled(true);
      setShowPayment(false);
      router.push('/dashboardUser/my-courses');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  const handlePayment = async () => {
    setPayError('');
    if (payMethod === 'card') {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        setPayError('Please fill in all card details.');
        return;
      }
    }
    setEnrolling(true);
    const finalPrice = getDiscountedPrice(Number(course.price));
    try {
      const res = await api.post('/payments', {
        amount: finalPrice,
        payment_method: payMethod,
        service_type: 'course',
        service_id: Number(id),
        card_number: payMethod === 'card' ? cardNumber.replace(/\s+/g, '') : null,
        voucher_id: applyVoucher && voucher ? voucher.id : null,
      });
      if (payMethod === 'cash') {
        setPayError('');
        alert(res.data.message);
      }
      await doEnroll();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Payment failed. Please try again.';
      setPayError(msg);
      setEnrolling(false);
    }
  };

  const handleWishlist = async () => {
    try {
      await api.post('/enrollments/wishlist', { course_id: id });
      alert('Added to wishlist!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add to wishlist');
    }
  };

  if (loading) return <div className="p-20 text-center text-[#602AEA] font-bold">Loading course...</div>;
  if (!course) return <div className="p-20 text-center text-red-500">Course not found.</div>;

  const isFree = Number(course.price) === 0;

  const avgRating = course.reviews?.length
    ? (course.reviews.reduce((s: number, r: any) => s + r.rating, 0) / course.reviews.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-[#F8F9FE] p-8 text-[#141033]">
      <div className="max-w-[1200px] mx-auto grid grid-cols-12 gap-8">

        {/* Left Side */}
        <div className="col-span-8 space-y-6">
          {/* Hero Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex gap-6">
              <div className="w-[320px] h-48 bg-indigo-900 rounded-2xl flex items-center justify-center shrink-0">
                <Play className="text-white fill-white" size={40} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-[#602AEA] bg-purple-50 px-2 py-1 rounded mb-2 inline-block">
                  {course.category || 'General'}
                </span>
                <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center gap-5 text-xs mb-4 flex-wrap">
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-[10px]">
                      {course.teacher?.name?.charAt(0) || 'T'}
                    </div>
                    <strong>{course.teacher?.name || 'Unknown'}</strong>
                  </div>
                  {avgRating && (
                    <div className="flex items-center gap-1 text-yellow-500 font-bold">
                      <span className="text-yellow-400 text-xs">★</span>
                      {avgRating}
                      <span className="text-gray-400 font-normal">({course.reviews?.length} reviews)</span>
                    </div>
                  )}
                  {course.capacity && (
                    <div className="text-gray-500">👥 {course.capacity} capacity</div>
                  )}
                  {course.duration && (
                    <div className="text-gray-500">🕒 {course.duration}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex gap-8 border-b border-gray-100 mb-6 text-sm font-bold text-gray-400">
              {['about', 'curriculum', 'instructor', 'reviews'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`pb-3 capitalize transition ${activeTab === tab ? 'text-[#602AEA] border-b-2 border-[#602AEA]' : 'hover:text-[#602AEA]'}`}>
                  {tab === 'reviews' ? `Reviews (${course.reviews?.length ?? 0})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === 'about' && (
              <>
                <h2 className="text-lg font-bold mb-3">About This Course</h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{course.description}</p>
                <div className="bg-[#F8F7FF] p-6 rounded-2xl mb-6">
                  <h3 className="font-bold text-sm mb-3">What you'll get</h3>
                  <ul className="grid grid-cols-2 gap-y-2 text-xs text-gray-700">
                    {['Full lifetime access', 'Access on mobile and desktop', 'Practice files and resources', 'Certificate of completion'].map(b => (
                      <li key={b} className="flex items-center gap-2"><Check size={14} className="text-[#602AEA]" />{b}</li>
                    ))}
                  </ul>
                </div>
                {course.outcomes?.length > 0 && (
                  <>
                    <h3 className="font-bold text-sm mb-3">What You'll Learn</h3>
                    <ul className="grid grid-cols-2 gap-2 mb-6">
                      {course.outcomes.map((o: any) => (
                        <li key={o.id} className="flex items-start gap-2 text-xs text-gray-700">
                          <Check size={13} className="text-[#602AEA] mt-0.5 shrink-0" />{o.description}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}

            {activeTab === 'curriculum' && (
              <>
                <h2 className="text-lg font-bold mb-4">Course Curriculum</h2>
                {course.sections?.length > 0 ? course.sections.map((section: any) => (
                  <div key={section.id} className="mb-4 border rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 font-bold text-sm">{section.title}</div>
                    {section.lessons?.map((lesson: any) => (
                      <div key={lesson.id} className="px-4 py-2.5 border-t flex items-center gap-3 text-sm text-gray-600">
                        <Play size={14} className="text-[#602AEA]" />
                        {lesson.title}
                        {lesson.duration && <span className="ml-auto text-xs text-gray-400">{lesson.duration}</span>}
                      </div>
                    ))}
                  </div>
                )) : <p className="text-gray-400 text-sm">No curriculum added yet.</p>}
              </>
            )}

            {activeTab === 'instructor' && (
              <>
                <h2 className="text-lg font-bold mb-4">About the Instructor</h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xl">
                    {course.teacher?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold">{course.teacher?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{course.teacher?.role}</p>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'reviews' && (
              <>
                <h2 className="text-lg font-bold mb-4">Student Reviews</h2>
                {course.reviews?.length > 0 ? (
                  <div className="flex gap-8 items-start mb-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold mb-1">{avgRating}</div>
                      <div className="flex text-yellow-400 text-xs mb-1">{'★'.repeat(Math.round(Number(avgRating)))}</div>
                      <div className="text-gray-400 text-[10px]">({course.reviews.length} reviews)</div>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5,4,3,2,1].map(star => {
                        const count = course.reviews.filter((r: any) => Math.round(r.rating) === star).length;
                        const pct = Math.round((count / course.reviews.length) * 100);
                        return (
                          <div key={star} className="flex items-center gap-3 text-[10px]">
                            <span className="w-4">{star} ★</span>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full">
                              <div style={{width:`${pct}%`}} className="h-full bg-yellow-400 rounded-full"/>
                            </div>
                            <span className="w-8 text-right">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : <p className="text-gray-400 text-sm">No reviews yet.</p>}
                <div className="space-y-4">
                  {course.reviews?.map((review: any) => (
                    <div key={review.id} className="bg-gray-50 p-4 rounded-xl border">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                          {review.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-xs">{review.user?.name || 'Student'}</p>
                          <div className="text-yellow-400 text-[10px]">{'★'.repeat(review.rating)}</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-6">
            <h2 className="text-3xl font-bold mb-4">
              {Number(course.price) === 0
                ? <span className="text-green-600">Free</span>
                : <>EGP {Number(course.price).toLocaleString()}</>}
            </h2>
            {course.duration && <p className="text-xs text-gray-500 mb-1">🕒 Duration: {course.duration}</p>}
            {course.capacity && <p className="text-xs text-gray-500 mb-4">👥 Capacity: {course.capacity} students</p>}

            <button
              onClick={handleEnrollClick}
              disabled={enrolling || enrolled}
              className="w-full bg-[#602AEA] text-white py-4 rounded-xl font-bold mb-3 hover:bg-[#5022C0] transition disabled:opacity-60">
              {enrolled ? '✓ Enrolled!' : enrolling ? 'Processing...' : isFree ? 'Enroll for Free' : 'Enroll Now'}
            </button>
            <button
              onClick={handleWishlist}
              className="w-full border border-gray-200 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50">
              <Heart size={18} /> Add to Wishlist
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-sm mb-4">Instructor</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg">
                {course.teacher?.name?.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-sm">{course.teacher?.name}</p>
                <p className="text-[10px] text-gray-500 capitalize">{course.teacher?.role}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-sm mb-2">Have questions?</h3>
            <p className="text-[10px] text-gray-500 mb-4">We're here to help!</p>
            <button className="w-full border border-gray-200 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
              <MessageSquare size={16} /> Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <h2 className="text-xl font-bold mb-1">Complete Payment</h2>
            <p className="text-gray-500 text-sm mb-6">{course.title}</p>

            {/* Voucher toggle */}
            {voucher && (
              <div className={`rounded-2xl p-4 border-2 mb-4 cursor-pointer transition ${applyVoucher ? 'border-[#602AEA] bg-purple-50' : 'border-gray-200 bg-gray-50'}`}
                onClick={() => setApplyVoucher(v => !v)}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#141033]">🎁 {voucher.title}</p>
                    <p className="text-xs text-gray-500">
                      {voucher.discount_type === 'percent'
                        ? `${voucher.discount_value}% off this course`
                        : `EGP ${voucher.discount_value} off`}
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${applyVoucher ? 'bg-[#602AEA] border-[#602AEA]' : 'border-gray-300'}`}>
                    {applyVoucher && <i className="fa-solid fa-check text-white text-[9px]"></i>}
                  </div>
                </div>
              </div>
            )}

            {/* Price summary */}
            <div className="bg-purple-50 rounded-2xl p-4 mb-6">
              {applyVoucher && voucher && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Original Price</span>
                  <span className="text-sm text-gray-500 line-through">EGP {Number(course.price).toLocaleString()}</span>
                </div>
              )}
              {applyVoucher && voucher && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-green-600 font-medium">Discount ({voucher.title})</span>
                  <span className="text-sm text-green-600 font-bold">
                    -EGP {(Number(course.price) - getDiscountedPrice(Number(course.price))).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700">Total Amount</span>
                <span className="text-xl font-bold text-[#602AEA]">
                  EGP {getDiscountedPrice(Number(course.price)).toLocaleString('en', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </span>
              </div>
            </div>

            {/* Payment method tabs */}
            <div className="flex gap-3 mb-6">
              {(['card', 'cash'] as const).map((m) => (
                <button key={m} onClick={() => setPayMethod(m)}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm border-2 transition ${payMethod === m ? 'border-[#602AEA] bg-purple-50 text-[#602AEA]' : 'border-gray-200 text-gray-500'}`}>
                  {m === 'card' ? '💳 Credit Card' : '💵 Cash'}
                </button>
              ))}
            </div>

            {payMethod === 'card' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">Card Number</label>
                  <input value={cardNumber} onChange={e => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9012 3456" maxLength={19}
                    autoComplete="off" name="cc-number"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#602AEA]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">Cardholder Name</label>
                  <input value={cardName} onChange={e => setCardName(e.target.value)}
                    placeholder="Ahmed Mohamed" autoComplete="off" name="cc-name"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#602AEA]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1 block">Expiry Date</label>
                    <input value={cardExpiry} onChange={e => setCardExpiry(e.target.value)}
                      placeholder="MM/YY" maxLength={5}
                      autoComplete="off" name="cc-exp" inputMode="numeric"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#602AEA]" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1 block">CVV</label>
                    <input value={cardCvv} onChange={e => setCardCvv(e.target.value)}
                      placeholder="•••" maxLength={3}
                      autoComplete="off" name="cc-csc" inputMode="numeric"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#602AEA]" />
                  </div>
                </div>
              </div>
            )}

            {payMethod === 'cash' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6 text-sm text-yellow-800">
                💡 You will pay <strong>EGP {Number(course.price).toLocaleString()}</strong> in cash at the first session. Your spot will be reserved now.
              </div>
            )}

            <div className="flex gap-3">
              {payError && (
                <div className="col-span-2 w-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2 mb-2">
                  <i className="fa-solid fa-circle-exclamation shrink-0"></i>
                  {payError}
                </div>
              )}
              <button onClick={() => { setShowPayment(false); setPayError(''); }}
                className="flex-1 border border-gray-200 py-3 rounded-xl font-bold text-sm hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handlePayment} disabled={enrolling}
                className="flex-1 bg-[#602AEA] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#5022C0] disabled:opacity-60">
                {enrolling ? 'Processing...' : `Pay EGP ${getDiscountedPrice(Number(course.price)).toLocaleString('en', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
