import React from 'react';
import { Award, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { accreditationData } from '../../../utils/staticData';

const AccreditationSection: React.FC = () => {
  const { t } = useLanguage();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'expired':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'expired':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Award className="w-6 h-6 mr-2 text-purple-600" />
            {t('accreditationTitle')}
          </h3>
          <p className="text-gray-600 mt-1">{t('accreditationSubtitle')}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-purple-600">
            {accreditationData.filter(acc => acc.status === 'active').length}
          </p>
          <p className="text-sm text-gray-500">{t('active')}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('program')}</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('level')}</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('accreditor')}</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('validUntil')}</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('status')}</th>
            </tr>
          </thead>
          <tbody>
            {accreditationData.map((accreditation) => (
              <tr key={accreditation.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">{accreditation.program}</td>
                <td className="py-3 px-4 text-gray-600">{accreditation.level}</td>
                <td className="py-3 px-4 text-gray-600">{accreditation.accreditor}</td>
                <td className="py-3 px-4 text-gray-600">{accreditation.validUntil}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getStatusColor(accreditation.status)}`}>
                    {getStatusIcon(accreditation.status)}
                    <span className="ml-1">{t(accreditation.status)}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccreditationSection;
