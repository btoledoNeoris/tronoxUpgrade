DECLARE @FL_SHOWALL	BIT = 0


--limit showing all lots to bottom level workcenter groups or when a material filter is specified
SET @FL_SHOWALL = CASE WHEN (SELECT COUNT(ID_GROUP) FROM [WORK_CENTER_GROUP] WHERE ID_GROUP_PAREN = '[Param.4]') = 0 THEN 1 ELSE 0 END;
SET @FL_SHOWALL = CASE WHEN '[Param.1]' = '1100' AND ('[Param.4]' = 'BAGHOPPR' OR '[Param.4]' = 'HAM_LAB_') THEN 0 ELSE @FL_SHOWALL END;
SET @FL_SHOWALL = CASE WHEN '[Param.1]' = '3100' AND ('[Param.4]' = 'K42_BAGH' OR '[Param.4]' = 'K42_DWFC'  OR '[Param.4]' = 'K_KWILAB') THEN 0 ELSE @FL_SHOWALL END;
SET @FL_SHOWALL = CASE WHEN LEN('[Param.5]') > 0 THEN 1 ELSE @FL_SHOWALL END;

SELECT
	V.ID_INSPE_LOT
	,V.CD_USAGE_DECIS
	,V.ID_INSPE_OPERA
	,C.ID_INSPE_CHARA
	,CM.ID_CHARA_MASTE
	,C.CD_INSPE_CHARA_TYPE
	,R.ID_INSPE_CATAL_SET
	,CASE WHEN C.DS_FORMU IS NOT NULL THEN 'X' ELSE NULL END AS DS_FORMU
	,CASE WHEN C.CD_INSPE_CHARA_TYPE != '01' THEN
			(SELECT STUFF (
				(SELECT N'||' + LTRIM(RTRIM(ID_INSPE_CATAL_CODE)) 
				FROM INSPECTION_RESULT_CATALOG_CODE 
				WHERE ID_INSPE_CATAL_SET = C.ID_INSPE_CATAL_SET 
				ORDER BY DS_INSPE_CATAL_CODE FOR XML PATH(''),TYPE)
				.value('text()[1]','nvarchar(max)'),1,2,N''))
		ELSE NULL END AS ID_INSPE_CATAL_CODE_LIST
	,CASE WHEN C.CD_INSPE_CHARA_TYPE != '01' THEN
			(SELECT STUFF (
				(SELECT N'||' + LTRIM(RTRIM(DS_INSPE_CATAL_CODE)) 
				FROM INSPECTION_RESULT_CATALOG_CODE 
				WHERE ID_INSPE_CATAL_SET = C.ID_INSPE_CATAL_SET 
				ORDER BY DS_INSPE_CATAL_CODE FOR XML PATH(''),TYPE)
				.value('text()[1]','nvarchar(max)'),1,2,N''))
		ELSE NULL END AS DS_INSPE_CATAL_CODE_LIST
	,P.ID_INSPE_POINT
	,P.ID_INSPE_POINT_STATU
	,P.CD_INSPE_POINT
	,P.CD_SAMPL_MACHI
	,CASE WHEN C.CD_INSPE_CHARA_TYPE = '01' THEN
			CAST(R.QT_RESUL AS VARCHAR)
		ELSE
			R.ID_INSPE_CATAL_CODE
		END AS DS_RESUL
	,R.DS_ATTR
	,(select isnull(( SELECT 'ALARM' =
		case
		when spc.QT_RESUL = r.QT_RESUL and spc.FL_ACTIV = 1 then '#F1948A'
		when spc.QT_RESUL = r.QT_RESUL and spc.FL_ACTIV = 0 then '#F39C12'
		when spc.QT_RESUL <> r.QT_RESUL and spc.FL_ACTIV = 1 then '#F6F931'
		when spc.QT_RESUL <> r.QT_RESUL and spc.FL_ACTIV = 0 then '#85C1E9'
		end
		FROM SPC_ALARM SPC WHERE SPC.ID_INSPE_RESUL = R.ID_INSPE_RESUL 
 		group by SPC.QT_RESUL, FL_ACTIV),'#CCFFCC')) as QT_ALARM
	,P.DT_CREAT
	,(SELECT STUFF (
			(SELECT N'; ' + CAST(CONVERT(DECIMAL (18,6), QT_RESUL_OLD) AS VARCHAR) + 
			' ('+CONVERT(VARCHAR, DT_CREAT, 11)+' '+CONVERT(VARCHAR, DT_CREAT, 108)+')' 
			FROM INSPECTION_RESULT_LOG 
			WHERE ID_INSPE_RESUL = R.ID_INSPE_RESUL
			ORDER BY DT_CREAT FOR XML PATH(''),TYPE)
			.value('text()[1]','nvarchar(max)'),1,2,N'')) AS DS_RESUL_OLD
	FROM (
	SELECT
	L.ID_INSPE_LOT
	,O.ID_INSPE_OPERA
	,W.ID_WORK_CENTE
	,M.ID_MATER
	,M.DS_MATER
	,L.CD_BATCH 
	,W.CD_WORK_CENTE
	,MAX(P.DT_CREAT) AS DT_CREAT
	,L.CD_USAGE_DECIS
		FROM [INSPECTION_LOT] L
		JOIN [MATERIAL] M ON L.ID_MATER = M.ID_MATER
		JOIN [INSPECTION_LOT_OPERATION] O ON L.ID_INSPE_LOT = O.ID_INSPE_LOT
		JOIN [WORK_CENTER] W ON O.ID_WORK_CENTE = W.ID_WORK_CENTE
		LEFT OUTER JOIN [INSPECTION_POINT] P ON O.ID_INSPE_LOT = P.ID_INSPE_LOT AND O.ID_INSPE_OPERA = P.ID_INSPE_OPERA
	WHERE L.ID_PLANT = '[Param.1]' AND O.ID_WORK_CENTE IN (SELECT ID_WORK_CENTE FROM FC_GET_WORK_CENTER_FROM_GROUP('[Param.4]'))
	AND L.ID_MATER LIKE '[Param.5]%'  AND L.CD_BATCH LIKE '%[Param.8]%'
	AND ((CD_BATCH = '' AND CD_USAGE_DECIS IS NULL AND @FL_SHOWALL=1) OR ((L.DT_CREAT BETWEEN '[Param.6]' AND '[Param.7]') AND CD_BATCH LIKE '_%') OR (P.DT_CREAT BETWEEN '[Param.6]' AND '[Param.7]'))
	GROUP BY L.ID_INSPE_LOT, O.ID_INSPE_OPERA, W.ID_WORK_CENTE, M.ID_MATER, M.DS_MATER, L.CD_BATCH, W.CD_WORK_CENTE, L.CD_USAGE_DECIS
	) AS V
	LEFT OUTER JOIN [INSPECTION_POINT] P ON V.ID_INSPE_LOT = P.ID_INSPE_LOT AND V.ID_INSPE_OPERA = P.ID_INSPE_OPERA AND P.DT_CREAT = V.DT_CREAT AND P.DT_CREAT > '[Param.6]'
	JOIN [INSPECTION_LOT_CHARACTERISTIC] C ON V.ID_INSPE_LOT = C.ID_INSPE_LOT AND V.ID_INSPE_OPERA = C.ID_INSPE_OPERA
	JOIN [CHARACTERISTIC_MASTER] CM ON C.ID_CHARA_MASTE = CM.ID_CHARA_MASTE AND C.ID_PLANT = CM.ID_PLANT
	LEFT OUTER JOIN [INSPECTION_RESULT] R ON P.ID_INSPE_LOT = R.ID_INSPE_LOT AND P.ID_INSPE_OPERA = R.ID_INSPE_OPERA AND P.ID_INSPE_POINT = R.ID_INSPE_POINT AND C.ID_INSPE_CHARA = R.ID_INSPE_CHARA
ORDER BY 
	C.ID_INSPE_LOT,
	C.ID_INSPE_OPERA,
	ISNULL(C.ID_SORT, C.ID_INSPE_CHARA)