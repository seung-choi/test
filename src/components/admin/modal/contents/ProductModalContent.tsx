'use client';

import React, { useMemo, useState } from 'react';
import CommonModalLayout from '@/components/admin/modal/CommonModalLayout';
import commonStyles from '@/styles/components/admin/modal/CommonModal.module.scss';
import styles from '@/styles/components/admin/modal/ProductModal.module.scss';
import { ProductFormData, ErpProduct } from '@/types';
import CustomSelect from '@/components/common/CustomSelect';
import useUnifiedModal from '@/hooks/admin/useUnifiedModal';
import { useToggleSelection } from '@/hooks/admin/useToggleSelection';
import { formatDate, formatPrice } from '@/utils';
import type { GoodsChannel, GoodsOption, GoodsStatus } from '@/api/goods';
import { useCategoryList } from '@/hooks/api/useCategory';
import { usePostGoods, usePutGoods } from '@/hooks/api/useGoods';
import { PostGoodsRequest, PutGoodsRequest } from '@/api/goods';
import { GOODS_STATUS_OPTIONS } from '@/constants/admin/menuStatus';
import { CHANNEL_OPTIONS, TYPE_OPTIONS } from '@/constants/admin/goodsOptions';
import ImageUpload from './product/ImageUpload';
import TimeControl from './product/TimeControl';
import TagSelector from './product/TagSelector';

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

  const { openCategoryModal, openErpSearchModal } = useUnifiedModal();
  const { data: categoryList = [] } = useCategoryList('CATEGORY');
  const postGoodsMutation = usePostGoods();
  const putGoodsMutation = usePutGoods();

  const categoryOptions = categoryList.map((category) => ({
    value: String(category.categoryId),
    label: category.categoryNm,
  }));

  const { selectedItems: selectedChannels, handleToggle: handleChannelToggle } = useToggleSelection<
    Exclude<GoodsChannel, 'BOTH'>,
    'BOTH'
  >({
    value: formData.goodsCh,
    onChange: (value) => setFormData((prev) => ({ ...prev, goodsCh: value as GoodsChannel })),
    options: ['COS', 'HUS'] as const,
    bothValue: 'BOTH',
  });

  const { selectedItems: selectedTypes, handleToggle: handleTypeToggle } = useToggleSelection<
    Exclude<GoodsOption, 'BOTH'>,
    'BOTH'
  >({
    value: formData.goodsOp,
    onChange: (value) => setFormData((prev) => ({ ...prev, goodsOp: value as GoodsOption })),
    options: ['DINE', 'TAKE'] as const,
    bothValue: 'BOTH',
  });

  const handleStatusChange = (status: GoodsStatus) => {
    setFormData((prev) => ({ ...prev, goodsSt: status }));
  };

  const selectedTags = useMemo(() => {
    if (!formData.goodsTag) return [];
    return formData.goodsTag
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
      .map((tag) => tag.replace(/^#/, ''));
  }, [formData.goodsTag]);

  const handleTagToggle = (tag: string) => {
    const nextTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : selectedTags.length < 2
      ? [...selectedTags, tag]
      : selectedTags;

    setFormData((prev) => ({
      ...prev,
      goodsTag: nextTags.map((value) => `#${value}`).join(','),
    }));
  };

  const handleImageChange = (file: File) => {
    setFormData((prev) => ({ ...prev, goodsImg: file }));
  };

  const handleTimeChange = (value: number) => {
    setFormData((prev) => ({ ...prev, goodsTm: value }));
  };

  const handleSubmit = async () => {
    if (!formData.goodsNm || !formData.goodsAmt || !formData.goodsErp) {
      alert('필수 항목을 입력해주세요.');
      return;
    }

    try {
      if (mode === 'create') {
        const payload: PostGoodsRequest = {
          categoryId: formData.categoryId ?? 0,
          goodsNm: formData.goodsNm,
          goodsAmt: formData.goodsAmt,
          goodsCnt: formData.goodsCnt,
          goodsCh: formData.goodsCh,
          goodsOp: formData.goodsOp,
          goodsTm: formData.goodsTm,
          goodsImg: formData.goodsImg instanceof File ? formData.goodsImg : undefined,
          goodsTag: formData.goodsTag || undefined,
          goodsErp: formData.goodsErp || undefined,
        };
        await postGoodsMutation.mutateAsync(payload);
      } else {
        if (!formData.goodsId) {
          alert('상품 ID가 없습니다.');
          return;
        }
        const payload: PutGoodsRequest = {
          categoryId: formData.categoryId ?? 0,
          goodsNm: formData.goodsNm,
          goodsAmt: formData.goodsAmt,
          goodsCnt: formData.goodsCnt,
          goodsCh: formData.goodsCh,
          goodsOp: formData.goodsOp,
          goodsTm: formData.goodsTm,
          goodsImg: formData.goodsImg instanceof File ? formData.goodsImg : undefined,
          goodsTag: formData.goodsTag || undefined,
        };
        await putGoodsMutation.mutateAsync({ goodsId: formData.goodsId, data: payload });
      }

      // Call the onSubmit callback if provided (for any additional logic)
      onSubmit(formData);

      alert('저장되었습니다.');
      onClose();
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('저장에 실패했습니다.');
    }
  };

  const handleCategorySettings = () => {
    openCategoryModal(() => {});
  };

  const isSubmitting = postGoodsMutation.isPending || putGoodsMutation.isPending;

  const buttons = (
    <>
      <button className={commonStyles.cancelButton} onClick={onClose} disabled={isSubmitting}>
        닫기
      </button>
      <button className={commonStyles.confirmButton} onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? '저장 중...' : '저장'}
      </button>
    </>
  );

  return (
    <CommonModalLayout
      title={mode === 'create' ? '상품 등록' : '상품 수정'}
      buttons={buttons}
      contentClassName={styles.scrollContent}
    >

      <div className={styles.content}>
        <div className={styles.formRow}>
          <div className={styles.label}>상태</div>
          <div className={styles.buttonGroup}>
            {GOODS_STATUS_OPTIONS.map((status) => (
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
          <div className={`${styles.buttonGroup} ${styles.buttonGroupMedium}`}>
            {CHANNEL_OPTIONS.map((channel) => (
              <button
                key={channel.value}
                className={`${styles.optionButton} ${styles.wide} ${
                  selectedChannels.includes(channel.value) ? styles.active : ''
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
          <div className={`${styles.buttonGroup} ${styles.buttonGroupMedium}`}>
            {TYPE_OPTIONS.map((type) => (
              <button
                key={type.value}
                className={`${styles.optionButton} ${styles.wide} ${
                  selectedTypes.includes(type.value) ? styles.active : ''
                }`}
                onClick={() => handleTypeToggle(type.value)}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={`${styles.label} ${styles.labelTall}`}>사진 등록</div>
          <ImageUpload image={formData.goodsImg} onChange={handleImageChange} />
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
            style={{ backgroundColor: '#f3f3f3'}}
            readOnly
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.label}>상품명</div>
          <input
            type="text"
            className={styles.input}
            value={formData.goodsNm}
            onChange={(e) => setFormData({ ...formData, goodsNm: e.target.value })}
            style={{ backgroundColor: '#f3f3f3'}}
            readOnly
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
            style={{ backgroundColor: '#f3f3f3'}}
            readOnly
          />
        </div>

        <div className={styles.formRow}>
          <div className={`${styles.label} ${styles.labelMedium}`}>조리 시간</div>
          <TimeControl value={formData.goodsTm} onChange={handleTimeChange} />
        </div>

        <div className={styles.formRow}>
          <div className={`${styles.label} ${styles.labelSmall}`}>
            태그 설정
            <span className={styles.labelSub}>(최대 2개)</span>
          </div>
          <TagSelector selectedTags={selectedTags} onToggle={handleTagToggle} />
        </div>

        {mode === 'edit' && (
          <div className={styles.formRow}>
            <div className={`${styles.label} ${styles.labelExtraSmall}`}>등록 정보</div>
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
