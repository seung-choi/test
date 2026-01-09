'use client';

import React, { useMemo, useRef, useState } from 'react';
import CommonModalLayout from '@/components/admin/modal/CommonModalLayout';
import commonStyles from '@/styles/components/admin/modal/CommonModal.module.scss';
import styles from '@/styles/components/admin/modal/ProductModal.module.scss';
import { ProductFormData, Category, ErpProduct } from '@/types';
import CustomSelect from '@/components/common/CustomSelect';
import { MENU_TAGS, getTagClass } from '@/constants/admin/tags/menuTags';
import useUnifiedModal from '@/hooks/admin/useUnifiedModal';
import { formatDate, formatPrice } from '@/utils';
import type { GoodsChannel, GoodsOption, GoodsStatus } from '@/api/goods';

interface ProductModalContentProps {
  mode: 'create' | 'edit';
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => void;
  onClose: () => void;
}

const ProductModalContent: React.FC<ProductModalContentProps> = ({
  mode,
  initialData,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState<ProductFormData>(
    initialData || {
      goodsSt: 'Y',
      goodsCh: 'BOTH',
      goodsOp: 'BOTH',
      categoryId: 0,
      categoryNm: '',
      goodsNm: '100% 한우 버거',
      goodsAmt: 15000,
      goodsCnt: '1',
      goodsTm: 0,
      goodsTag: '',
      goodsErp: '110595',
      createdDt: new Date().toISOString(),
      modifiedDt: new Date().toISOString(),
    }
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { openCategoryModal, openErpSearchModal } = useUnifiedModal();

  const statusOptions: { value: GoodsStatus; label: string }[] = [
    { value: 'Y', label: '판매' },
    { value: 'S', label: '대기' },
    { value: 'N', label: '중지' },
  ];
  const channelOptions: { value: GoodsChannel; label: string }[] = [
    { value: 'COS', label: '코스' },
    { value: 'HUS', label: '매장' },
  ];
  const typeOptions: { value: GoodsOption; label: string }[] = [
    { value: 'DINE', label: '매장' },
    { value: 'TAKE', label: '포장' },
  ];
  const categoryOptions = [
    { value: '1', label: '음식' },
    { value: '2', label: '음료' },
    { value: '3', label: '기타' },
  ];

  const handleStatusChange = (status: GoodsStatus) => {
    setFormData((prev) => ({ ...prev, goodsSt: status }));
  };

  const getSelectedChannels = (channel: GoodsChannel): GoodsChannel[] => {
    return channel === 'BOTH' ? ['COS', 'HUS'] : [channel];
  };

  const getSelectedTypes = (option: GoodsOption): GoodsOption[] => {
    return option === 'BOTH' ? ['DINE', 'TAKE'] : [option];
  };

  const getSelectedTags = useMemo(() => {
    if (!formData.goodsTag) return [];
    return formData.goodsTag
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
      .map((tag) => tag.replace(/^#/, ''));
  }, [formData.goodsTag]);

  const getChannelValue = (channels: GoodsChannel[]): GoodsChannel => {
    const hasCos = channels.includes('COS');
    const hasHus = channels.includes('HUS');
    if (hasCos && hasHus) return 'BOTH';
    if (hasCos) return 'COS';
    if (hasHus) return 'HUS';
    return 'BOTH';
  };

  const getTypeValue = (types: GoodsOption[]): GoodsOption => {
    const hasDine = types.includes('DINE');
    const hasTake = types.includes('TAKE');
    if (hasDine && hasTake) return 'BOTH';
    if (hasDine) return 'DINE';
    if (hasTake) return 'TAKE';
    return 'BOTH';
  };

  const handleChannelToggle = (channel: GoodsChannel) => {
    const selected = getSelectedChannels(formData.goodsCh);
    const nextSelected = selected.includes(channel)
      ? selected.filter((c) => c !== channel)
      : [...selected, channel];

    setFormData((prev) => ({
      ...prev,
      goodsCh: getChannelValue(nextSelected),
    }));
  };

  const handleTypeToggle = (type: GoodsOption) => {
    const selected = getSelectedTypes(formData.goodsOp);
    const nextSelected = selected.includes(type)
      ? selected.filter((t) => t !== type)
      : [...selected, type];

    setFormData((prev) => ({
      ...prev,
      goodsOp: getTypeValue(nextSelected),
    }));
  };

  const handleTagToggle = (tag: string) => {
    const nextTags = getSelectedTags.includes(tag)
      ? getSelectedTags.filter((t) => t !== tag)
      : getSelectedTags.length < 2
      ? [...getSelectedTags, tag]
      : getSelectedTags;

    setFormData((prev) => ({
      ...prev,
      goodsTag: nextTags.map((value) => `#${value}`).join(','),
    }));
  };

  const handleCookingTimeChange = (delta: number) => {
    setFormData((prev) => ({
      ...prev,
      goodsTm: Math.max(0, prev.goodsTm + delta * 10),
    }));
  };

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setFormData((prev) => ({ ...prev, goodsImg: file }));
    }
  };

  const handleSubmit = () => {
    if (!formData.goodsNm || !formData.goodsAmt || !formData.goodsErp) {
      alert('필수 항목을 입력해주세요.');
      return;
    }
    onSubmit(formData);
  };

  const getTagClassName = (tag: string) => {
    if (getSelectedTags.includes(tag)) {
      return styles[getTagClass(tag)];
    }
    return styles.tagInactive;
  };

  const handleCategorySettings = () => {
    const initialCategories: Category[] = [
      { id: '1', name: '분식', order: 0 },
      { id: '2', name: '주류', order: 1 },
      { id: '3', name: '양식', order: 2 },
      { id: '4', name: '한식', order: 3 },
    ];

    openCategoryModal(
      initialCategories,
      (categories) => {},
      () => {}
    );
  };

  const handleErpUpdate = () => {
    openErpSearchModal(
      (erpProduct: ErpProduct) => {
        setFormData(prev => ({
          ...prev,
          categoryNm: prev.categoryNm || '미분류',
          goodsErp: erpProduct.goodsErp,
          goodsNm: erpProduct.goodsNm,
          goodsAmt: Number(erpProduct.goodsAmt),
          goodsCnt: erpProduct.goodsCnt || prev.goodsCnt,
        }));
      },
      () => {}
    );
  };

  const headerRight = mode === 'edit' ? (
    <div className={styles.erpUpdateButton} onClick={handleErpUpdate}>
      <div className={styles.erpUpdateText}>ERP 정보 업데이트</div>
      <div className={styles.erpUpdateIcon}>
        <img src="/assets/image/global/reload.svg" alt="erp_update" />
      </div>
    </div>
  ) : undefined;

  const buttons = (
    <>
      <button className={commonStyles.cancelButton} onClick={onClose}>
        닫기
      </button>
      <button className={commonStyles.confirmButton} onClick={handleSubmit}>
        저장
      </button>
    </>
  );

  return (
    <CommonModalLayout
      title={mode === 'create' ? '상품 등록' : '상품 수정'}
      headerRight={headerRight}
      buttons={buttons}
      contentClassName={styles.scrollContent}
    >

      <div className={styles.content}>
        <div className={styles.formRow}>
          <div className={styles.label}>상태</div>
          <div className={styles.buttonGroup}>
            {statusOptions.map((status) => (
              <button
                key={status.value}
                className={`${styles.optionButton} ${
                  formData.goodsSt === status.value ? styles.active : ''
                }`}
                onClick={() => handleStatusChange(status.value)}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.label}>
            채널
            <span className={styles.labelSub}>(중복선택 가능)</span>
          </div>
          <div className={styles.buttonGroup} style={{ height: '55px'}}>
            {channelOptions.map((channel) => (
              <button
                key={channel.value}
                className={`${styles.optionButton} ${styles.wide} ${
                  getSelectedChannels(formData.goodsCh).includes(channel.value) ? styles.active : ''
                }`}
                onClick={() => handleChannelToggle(channel.value)}
              >
                {channel.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.label}>
            유형
            <span className={styles.labelSub}>(중복선택 가능)</span>
          </div>
          <div className={styles.buttonGroup} style={{ height: '55px'}}>
            {typeOptions.map((type) => (
              <button
                key={type.value}
                className={`${styles.optionButton} ${styles.wide} ${
                  getSelectedTypes(formData.goodsOp).includes(type.value) ? styles.active : ''
                }`}
                onClick={() => handleTypeToggle(type.value)}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.label} style={{height: '130px'}}>사진 등록</div>
          <div className={styles.imageUpload} onClick={handleImageSelect}>
            <div className={styles.imagePreview}>
              {formData.goodsImg ? (
                <img
                  src={
                    formData.goodsImg instanceof File
                      ? URL.createObjectURL(formData.goodsImg)
                      : formData.goodsImg
                  }
                  alt="preview"
                  className={styles.previewImage}
                />
              ) : (
                <div className={styles.uploadIcon}>
                  <img src="/assets/image/global/cross.svg" alt="upload" />
                </div>
              )}
              <div className={styles.imageCount}>
                <span className={styles.current}>{formData.goodsImg ? 1 : 0}</span>
                <span className={styles.separator}> / </span>
                <span className={styles.max}>1</span>
              </div>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.label}>분류</div>
          <div className={styles.inputGroup}>
            <CustomSelect
              value={formData.categoryId ? String(formData.categoryId) : ''}
              onChange={(value) => {
                const selected = categoryOptions.find((option) => option.value === value);
                setFormData({
                  ...formData,
                  categoryId: selected ? Number(selected.value) : 0,
                  categoryNm: selected?.label || '',
                });
              }}
              options={[
                { value: '', label: '선택해주세요' },
                ...categoryOptions,
              ]}
              placeholder="선택해주세요"
            />
            <button className={styles.settingButton} onClick={handleCategorySettings}>분류 설정</button>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.label}>상품 코드</div>
          <input
            type="text"
            className={styles.input}
            value={formData.goodsErp || ''}
            onChange={(e) => setFormData({ ...formData, goodsErp: e.target.value })}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.label}>상품명</div>
          <input
            type="text"
            className={styles.input}
            value={formData.goodsNm}
            onChange={(e) => setFormData({ ...formData, goodsNm: e.target.value })}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.label}>판매가</div>
          <input
            type="text"
            className={styles.input}
            value={formData.goodsAmt ? formatPrice(formData.goodsAmt) : ''}
            onChange={(e) => {
              const nextValue = e.target.value.replace(/[^0-9]/g, '');
              setFormData({ ...formData, goodsAmt: nextValue ? Number(nextValue) : 0 });
            }}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.label} style={{height: '80px'}}>조리 시간</div>
          <div className={styles.timeControl}>
            <button
              className={`${styles.timeButton} ${formData.goodsTm === 0 ? styles.disabled : ''}`}
              onClick={() => handleCookingTimeChange(-1)}
              disabled={formData.goodsTm === 0}
            >
              <img src="/assets/image/global/plusminus/minus.svg" alt="minus" />
            </button>
            <div className={styles.timeValue}>{formData.goodsTm}</div>
            <button
              className={styles.timeButton}
              onClick={() => handleCookingTimeChange(1)}
            >
              <img src="/assets/image/global/plusminus/plus.svg" alt="plus" />
            </button>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.label} style={{height: '60px'}}>
            태그 설정
            <span className={styles.labelSub}>(최대 2개)</span>
          </div>
          <div className={styles.tagList}>
            {MENU_TAGS.map((tag) => (
              <button
                key={tag.value}
                className={`${styles.tag} ${getTagClassName(tag.value)}`}
                onClick={() => handleTagToggle(tag.value)}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {mode === 'edit' && (
          <div className={styles.formRow}>
            <div className={styles.label} style={{height: '55px'}}>등록 정보</div>
            <div className={styles.infoGroup}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>등록 일자</span>
                <span className={styles.infoValue}>
                  {formData.createdDt ? formatDate(formData.createdDt) : '-'}
                </span>
              </div>
              {formData.modifiedDt && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>업데이트 일자</span>
                  <span className={styles.infoValue}>
                    {formatDate(formData.modifiedDt)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </CommonModalLayout>
  );
};

export default ProductModalContent;
