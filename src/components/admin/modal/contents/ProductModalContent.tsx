'use client';

import React, { useState, useRef } from 'react';
import styles from '@/styles/components/modal/ProductModal.module.scss';
import { ProductFormData, Category } from '@/types/admin/modal.type';
import CustomSelect from '@/components/admin/common/CustomSelect';
import { MENU_TAGS, getTagClass } from '@/constants/admin/tags/menuTags';
import useUnifiedModal from '@/hooks/admin/useUnifiedModal';
import { ErpProduct } from '@/types/erp.type';

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
      status: '판매',
      channels: [],
      types: [],
      category: '',
      store: '스타트 하우스',
      code: '110595',
      name: '100% 한우 버거',
      price: '15,000원',
      cookingTime: 0,
      tags: [],
      registeredDate: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      updatedDate: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
    }
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { openCategoryModal, openErpSearchModal } = useUnifiedModal();

  const statusOptions = ['판매', '대기', '중지'] as const;
  const channelOptions = ['코스', '매장'];
  const typeOptions = ['매장', '포장'];

  const handleStatusChange = (status: '판매' | '대기' | '중지') => {
    setFormData((prev) => ({ ...prev, status }));
  };

  const handleChannelToggle = (channel: string) => {
    setFormData((prev) => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel],
    }));
  };

  const handleTypeToggle = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  };

  const handleTagToggle = (tag: string) => {
    setFormData((prev) => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : prev.tags.length < 2
        ? [...prev.tags, tag]
        : prev.tags;
      return { ...prev, tags: newTags };
    });
  };

  const handleCookingTimeChange = (delta: number) => {
    setFormData((prev) => ({
      ...prev,
      cookingTime: Math.max(0, prev.cookingTime + delta * 10),
    }));
  };

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.price || !formData.code) {
      alert('필수 항목을 입력해주세요.');
      return;
    }
    onSubmit(formData);
  };

  const getTagClassName = (tag: string) => {
    if (formData.tags.includes(tag)) {
      return styles[getTagClass(tag)];
    }
    return styles.tagInactive;
  };

  const handleCategorySettings = () => {
    // TODO: 실제 분류 데이터를 가져와야 함
    const initialCategories: Category[] = [
      { id: '1', name: '분식', order: 0 },
      { id: '2', name: '주류', order: 1 },
      { id: '3', name: '양식', order: 2 },
      { id: '4', name: '한식', order: 3 },
    ];

    openCategoryModal(
      initialCategories,
      (categories) => {
        console.log('분류 저장:', categories);
        // 여기서 실제 분류 저장 API 호출
      },
      () => {
        console.log('분류 설정 취소');
      }
    );
  };

  const handleErpUpdate = () => {
    openErpSearchModal(
      (erpProduct: ErpProduct) => {
        // ERP에서 선택한 상품 정보로 폼 데이터 업데이트
        setFormData(prev => ({
          ...prev,
          category: erpProduct.category,
          code: erpProduct.code,
          name: erpProduct.name,
          price: erpProduct.price.toLocaleString('ko-KR') + '원',
        }));
      },
      () => {
        console.log('ERP 검색 취소');
      }
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>{mode === 'create' ? '상품 등록' : '상품 수정'}</div>
        {mode === 'create' ? (
          <button className={styles.closeButton} onClick={onClose}>
            <img src="/assets/image/global/x.svg" alt="x" />
          </button>
        ) : (
          <div className={styles.erpUpdateButton} onClick={handleErpUpdate}>
            <div className={styles.erpUpdateText}>ERP 정보 업데이트</div>
            <div className={styles.erpUpdateIcon}>
              <img src="/assets/image/global/reload.svg" alt="erp_update" />
            </div>
          </div>
        )}
      </div>

      <div className={styles.divider} />

      <div className={styles.content}>
        <div className={styles.formRow}>
          <div className={styles.label}>상태</div>
          <div className={styles.buttonGroup}>
            {statusOptions.map((status) => (
              <button
                key={status}
                className={`${styles.optionButton} ${
                  formData.status === status ? styles.active : ''
                }`}
                onClick={() => handleStatusChange(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.label}>
            채널
            <span className={styles.labelSub}>(중복선택 가능)</span>
          </div>
          <div className={styles.buttonGroup}>
            {channelOptions.map((channel) => (
              <button
                key={channel}
                className={`${styles.optionButton} ${styles.wide} ${
                  formData.channels.includes(channel) ? styles.active : ''
                }`}
                onClick={() => handleChannelToggle(channel)}
              >
                {channel}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.label}>
            유형
            <span className={styles.labelSub}>(중복선택 가능)</span>
          </div>
          <div className={styles.buttonGroup}>
            {typeOptions.map((type) => (
              <button
                key={type}
                className={`${styles.optionButton} ${styles.wide} ${
                  formData.types.includes(type) ? styles.active : ''
                }`}
                onClick={() => handleTypeToggle(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.label} style={{height: '138px'}}>사진 등록</div>
          <div className={styles.imageUpload} onClick={handleImageSelect}>
            <div className={styles.imagePreview}>
              {formData.image ? (
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="preview"
                  className={styles.previewImage}
                />
              ) : (
                <div className={styles.uploadIcon}>
                  <img src="/assets/image/global/cross.svg" alt="upload" />
                </div>
              )}
              <div className={styles.imageCount}>
                <span className={styles.current}>{formData.image ? 1 : 0}</span>
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
              value={formData.category}
              onChange={(value) => setFormData({ ...formData, category: value })}
              options={[
                { value: '', label: '선택해주세요' },
                { value: '음식', label: '음식' },
                { value: '음료', label: '음료' },
                { value: '기타', label: '기타' },
              ]}
              placeholder="선택해주세요"
            />
            <button className={styles.settingButton} onClick={handleCategorySettings}>분류 설정</button>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.label}>매장</div>
          <CustomSelect
            value={formData.store}
            onChange={(value) => setFormData({ ...formData, store: value })}
            options={[
              { value: '스타트 하우스', label: '스타트 하우스' },
            ]}
            className={styles.input}
            style={{paddingLeft: 0, borderLeft: 0}}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.label}>상품 코드</div>
          <input
            type="text"
            className={styles.input}
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.label}>상품명</div>
          <input
            type="text"
            className={styles.input}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.label}>판매가</div>
          <input
            type="text"
            className={styles.input}
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.label}>조리 시간</div>
          <div className={styles.timeControl}>
            <button
              className={`${styles.timeButton} ${formData.cookingTime === 0 ? styles.disabled : ''}`}
              onClick={() => handleCookingTimeChange(-1)}
              disabled={formData.cookingTime === 0}
            >
              <img src="/assets/image/global/minus.svg" alt="minus" />
            </button>
            <div className={styles.timeValue}>{formData.cookingTime}</div>
            <button
              className={styles.timeButton}
              onClick={() => handleCookingTimeChange(1)}
            >
              <img src="/assets/image/global/plus.svg" alt="plus" />
            </button>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.label}>
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

        <div className={styles.formRow}>
          <div className={styles.label}>등록 정보</div>
          <div className={styles.infoGroup}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>등록 일자</span>
              <span className={styles.infoValue}>{formData.registeredDate}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>업데이트 일자</span>
              <span className={styles.infoValue}>{formData.updatedDate}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.cancelButton} onClick={onClose}>
          닫기
        </button>
        <button className={styles.confirmButton} onClick={handleSubmit}>
          저장
        </button>
      </div>
    </div>
  );
};

export default ProductModalContent;
