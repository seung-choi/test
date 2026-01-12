'use client';

import React, { useState, useEffect } from 'react';
import CommonModalLayout from '@/components/admin/modal/CommonModalLayout';
import commonStyles from '@/styles/components/admin/modal/CommonModal.module.scss';
import styles from '@/styles/components/admin/modal/ErpSearchModal.module.scss';
import { ErpProduct, ErpSearchType } from '@/types/erp.type';
import CustomSelect from '@/components/common/CustomSelect';
import { formatPrice } from '@/utils';
import { useGoodsErpList, usePutGoodsErpList } from '@/hooks/api';

interface ErpSearchModalContentProps {
  onSelect: (product: ErpProduct) => void;
  onClose: () => void;
}

const ErpSearchModalContent: React.FC<ErpSearchModalContentProps> = ({
  onSelect,
  onClose,
}) => {
  const [searchType, setSearchType] = useState<ErpSearchType>('상품 코드');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ErpProduct[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { data: erpList = [] } = useGoodsErpList();
  const { mutateAsync: updateErpList, isPending: isUpdating } = usePutGoodsErpList();

  useEffect(() => {
    setSearchResults(erpList);
    setHasSearched(false);
  }, [erpList]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults(erpList);
      setHasSearched(false);
      return;
    }

    const results = erpList.filter((product) => {
      if (searchType === '상품 코드') {
        return product.goodsErp.toLowerCase().includes(searchTerm.toLowerCase());
      } else {
        return product.goodsNm.toLowerCase().includes(searchTerm.toLowerCase());
      }
    });

    setSearchResults(results);
    setHasSearched(true);
  };

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);

    if (!value.trim()) {
      setSearchResults(erpList);
      setHasSearched(false);
      return;
    }

    const results = erpList.filter((product) => {
      if (searchType === '상품 코드') {
        return product.goodsErp.toLowerCase().includes(value.toLowerCase());
      } else {
        return product.goodsNm.toLowerCase().includes(value.toLowerCase());
      }
    });

    setSearchResults(results);
    setHasSearched(true);
  };

  const handleSelectProduct = (product: ErpProduct) => {
    onSelect(product);
  };

  const handleUpdateErpList = async () => {
    if (isUpdating) return;
    await updateErpList();
  };

  const buttons = (
    <button className={commonStyles.cancelButton} onClick={onClose}>
      닫기
    </button>
  );

  return (
    <CommonModalLayout
      title="ERP 검색"
      headerRight={
        <button
          className={styles.erpUpdateButton}
          onClick={handleUpdateErpList}
          disabled={isUpdating}
        >
          ERP 목록 업데이트
        </button>
      }
      buttons={buttons}
      contentClassName={styles.erpContent}
    >
      <div className={styles.searchSection}>
        <CustomSelect
          value={searchType}
          onChange={(value) => setSearchType(value as ErpSearchType)}
          options={[
            { value: '상품 코드', label: '상품 코드' },
            { value: '상품명', label: '상품명' },
          ]}
          className={styles.searchTypeSelect}
        />
        <div className={styles.searchInputGroup}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder={`${searchType}를 입력하세요`}
            value={searchTerm}
            onChange={(e) => handleSearchTermChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <button className={styles.searchButton} onClick={handleSearch}>
            <div className={styles.buttonText}>검색</div>
          </button>
        </div>
      </div>

      <div className={styles.resultLabel}>
        {searchTerm ? '검색 결과' : '전체 상품 목록'}
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.codeColumn}>
            <div className={styles.headerText}>상품 코드</div>
          </div>
          <div className={styles.nameColumn}>
            <div className={styles.headerText}>상품명</div>
          </div>
          <div className={styles.priceColumn}>
            <div className={styles.headerText}>금액</div>
          </div>
          <div className={styles.selectColumn}>
            <div className={styles.headerText}>선택</div>
          </div>
        </div>

        <div className={styles.tableBody}>
          {hasSearched && searchResults.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyText}>검색 결과가 없습니다.</div>
            </div>
          ) : (
            searchResults.map((product) => (
              <div
                key={product.goodsErp}
                className={styles.tableRow}
                onClick={() => handleSelectProduct(product)}
              >
                <div className={styles.codeColumn}>
                  <div className={styles.cellText}>{product.goodsErp}</div>
                </div>
                <div className={styles.nameColumn}>
                  <div className={styles.cellText}>{product.goodsNm}</div>
                </div>
                <div className={styles.priceColumn}>
                  <div className={styles.cellText}>{formatPrice(Number(product.goodsAmt))}</div>
                </div>
                <div className={styles.selectColumn}>
                  <div className={styles.cellText}>선택</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className={styles.gradient} />
    </CommonModalLayout>
  );
};

export default ErpSearchModalContent;
